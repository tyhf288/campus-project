import { Controller } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Post, Body, Get } from '@nestjs/common'

import { LoginDto } from './dto/login.dto'
import { Public } from './decorator/public.decorator'
import { RegisterDto } from './dto/register.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @Public()
  async signUp(@Body() registerDto: RegisterDto) {
    return this.authService.signUp(
      registerDto.nickname!,
      registerDto.password!,
      registerDto.loginKey!
    )
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.loginKey!, loginDto.password!)
  }

  //token验证
  @Get()
  async profile() {
    return true
  }
}
