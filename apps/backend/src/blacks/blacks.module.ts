import { Module } from '@nestjs/common'
import { BlacksService } from './blacks.service'
import { BlacksController } from './blacks.controller'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Black } from './entities/black.entity'
import { UsersModule } from '../users/users.module'
import { User } from '../users/entities/user.entity'
import { BlacksScheduler } from './blacks.scheduler'
import { BullModule } from '@nestjs/bull'
import { UnbanProcessor } from './unban.processor'

@Module({
  imports: [
    MikroOrmModule.forFeature([Black, User]),
    UsersModule,
    // 注册队列
    BullModule.registerQueue({
      name: 'auto-unban',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || undefined,
      },
      // 全局默认配置
      defaultJobOptions: {
        attempts: 3, // 失败重试3次
        backoff: {
          type: 'exponential', // 指数退避
          delay: 2000, // 首次重试延迟2秒
        },
        removeOnComplete: 100, // 保留最近100条成功记录
        removeOnFail: 50, // 保留最近50条失败记录
      },
    }),
  ],
  controllers: [BlacksController],
  providers: [BlacksService, BlacksScheduler, UnbanProcessor],
})
export class BlacksModule {}
