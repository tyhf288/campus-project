import { Module } from '@nestjs/common'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { LoggerModule } from 'nestjs-pino'
import config from './mikro-orm.config'
import { UsersModule } from './users/users.module'
import { pinoHttpConfig } from './common/configs/pino'
import { AuthModule } from './auth/auth.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { rateLimitConfig } from './common/configs/rate-limit'
import { ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { HttpModule } from '@nestjs/axios'
import { BlacksModule } from './blacks/blacks.module'
import { ScheduleModule } from '@nestjs/schedule'
import { RedisModule } from '@nestjs-modules/ioredis'
import redisConfig, { RedisConfigOptions } from './common/configs/redis.config'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    HttpModule,
    UsersModule,
    BlacksModule,
    MikroOrmModule.forRoot(config),
    LoggerModule.forRoot({
      pinoHttp: pinoHttpConfig,
    }),
    ThrottlerModule.forRoot(rateLimitConfig),
    AuthModule,
    BlacksModule,
    ScheduleModule.forRoot(),
    // ✅ 加载 Redis 配置
    ConfigModule.forRoot({
      load: [redisConfig],
      isGlobal: true,
    }),

    // ✅ Redis 模块配置（解耦后的简洁写法）
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConf = configService.get<RedisConfigOptions>('redis')

        if (!redisConf) {
          throw new Error('Redis configuration is not defined')
        }

        return {
          type: 'single',
          url: `redis://${
            redisConf.password ? `:${redisConf.password}@` : ''
          }${redisConf.host}:${redisConf.port}/${redisConf.db}`,
        }
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
