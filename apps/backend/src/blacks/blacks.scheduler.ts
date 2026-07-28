// apps/backend/src/blacks/blacks.scheduler.ts
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/core'
import { Black } from './entities/black.entity'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

@Injectable()
export class BlacksScheduler {
  private readonly logger = new Logger(BlacksScheduler.name)

  constructor(
    @InjectRepository(Black)
    private readonly blackRepository: EntityRepository<Black>,
    // 注入队列
    @InjectQueue('auto-unban')
    private readonly unbanQueue: Queue
  ) {}

  // 每分钟执行一次
  @Cron(CronExpression.EVERY_MINUTE)
  async handleAutoUnban() {
    this.logger.log('开始执行自动解封任务...')

    const now = new Date()

    // 查询所有已过期且未解封的记录，只查询ID 减少IO开销
    const expiredBlacks = await this.blackRepository.find(
      {
        unbannedAt: { $lte: now }, // 解封时间已到
        unbannedDate: null, // 尚未解封
      },
      {
        fields: ['id'], // 只查必要字段
        limit: 50, // 限制单次扫描数量
      }
    )

    if (expiredBlacks.length === 0) {
      this.logger.log('没有需要解封的记录')
      return
    }

    this.logger.log(`找到 ${expiredBlacks.length} 条需要解封的记录`)

    // ✅ 批量推送到队列（非阻塞）
    const jobs = await Promise.all(
      expiredBlacks.map((black) =>
        this.unbanQueue.add(
          'process-unban', // 任务名称
          { blackId: black.id }, // 任务数据
          {
            jobId: `unban-${black.id}-${Date.now()}`, // 唯一ID，防止重复
            priority: 1, // 优先级（1最低，10最高）
          }
        )
      )
    )
    this.logger.log(`成功推送 ${jobs.length} 个任务到队列`)
  }
}
