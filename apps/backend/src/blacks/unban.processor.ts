import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager, EntityRepository } from '@mikro-orm/core'
import { Black } from './entities/black.entity'
import { User } from '../users/entities/user.entity'
import { UserStatus } from '@campus/types'

@Processor('auto-unban') // 关联队列名称
@Injectable()
export class UnbanProcessor {
  private readonly logger = new Logger(UnbanProcessor.name)

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Black)
    private readonly blackRepository: EntityRepository<Black>
  ) {}

  // 监听队列中的任务
  @Process('process-unban')
  async handleUnban(job: Job<{ blackId: number }>) {
    const { blackId } = job.data

    this.logger.log(`开始处理任务: ${job.id}, 黑名单ID: ${blackId}`)

    try {
      // 开启事务处理单个任务
      await this.em.transactional(async (txEm) => {
        // 1. 查询黑名单记录
        const black = await txEm.findOne(Black, { id: blackId })

        if (!black) {
          this.logger.warn(`黑名单记录 ${blackId} 不存在，跳过`)
          return
        }

        // 幂等性检查：如果已经解封，直接返回
        if (black.unbannedDate) {
          this.logger.log(`黑名单 ${blackId} 已解封，跳过`)
          return
        }

        // 2. 查询用户
        const user = await txEm.findOne(User, { id: black.userId })

        if (!user) {
          throw new Error(`用户 ${black.userId} 不存在`)
        }

        // 3. 更新用户状态
        user.status = UserStatus.ACTIVE
        txEm.persist(user)

        // 4. 更新黑名单记录
        black.unbannedDate = new Date()
        black.unbannedById = null
        black.unbannedReason = '系统自动解封'
        txEm.persist(black)
      })

      this.logger.log(`✅ 任务 ${job.id} 处理成功: 用户 ${blackId} 已解封`)
    } catch (error) {
      this.logger.error(`❌ 任务 ${job.id} 处理失败:`, error)

      // 抛出异常触发重试机制
      throw error
    }
  }
}
