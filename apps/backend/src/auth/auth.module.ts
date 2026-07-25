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
import { PermissionGuard } from './guard/permission.guard'

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
      useClass: AuthGuard, // 全局守卫-登录token
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard, // 全局守卫-权限
    },
    WechatService,
  ],
})
export class AuthModule {}
