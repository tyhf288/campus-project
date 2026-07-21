import { Module } from '@nestjs/common'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { LoggerModule } from 'nestjs-pino'
import config from './mikro-orm.config'
import { TodosModule } from './todos/todos.module'
import { UsersModule } from './users/users.module'
import { pinoHttpConfig } from './common/configs/pino'
import { AuthModule } from './auth/auth.module'
import { ThrottlerModule } from '@nestjs/throttler'
import { rateLimitConfig } from './common/configs/rate-limit'
import { ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { HttpModule } from '@nestjs/axios'
import { BlacksModule } from './blacks/blacks.module'

@Module({
  imports: [
    HttpModule,
    TodosModule,
    UsersModule,
    BlacksModule,
    MikroOrmModule.forRoot(config),
    LoggerModule.forRoot({
      pinoHttp: pinoHttpConfig,
    }),
    ThrottlerModule.forRoot(rateLimitConfig),
    AuthModule,
    BlacksModule,
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
