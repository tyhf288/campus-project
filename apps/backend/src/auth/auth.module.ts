import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { AuthGuard } from './guard/auth.guard'
import { APP_GUARD } from '@nestjs/core'
import { WechatService } from './wechat.service'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    UsersModule,
    HttpModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h', algorithm: 'HS256' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    WechatService,
  ],
})
export class AuthModule {}
