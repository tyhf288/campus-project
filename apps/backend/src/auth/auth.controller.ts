import { Controller } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Post, Body, Get } from '@nestjs/common'

import { LoginDto } from './dto/login.dto'
import { AppletLoginDto } from './dto/appletLogin.dto'
import { Public } from './decorator/public.decorator'
import { RegisterDto } from './dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //注册
  @Post('register')
  @Public()
  async signUp(@Body() registerDto: RegisterDto) {
    return this.authService.signUp(
      registerDto.nickname!,
      registerDto.password!,
      registerDto.loginKey!,
      registerDto.role
    )
  }

  //pc端登录
  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.loginKey!, loginDto.password!)
  }

  //移动端登录
  @Post('mobile/login')
  @Public()
  async mobileLogin(@Body() appletLoginDto: AppletLoginDto) {
    return this.authService.appletLogin(appletLoginDto)
  }
  //token验证
  @Get()
  async profile() {}
}
