import { Controller } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Post, Body } from '@nestjs/common'
import { CreateSignUpDto } from './dto/create-signUp.dto'
import { LoginDto } from './dto/login.dto'
import { Public } from './decorator/public.decorator'
import { Throttle } from '@nestjs/throttler'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @Public()
  async signUp(@Body() createSignUpDto: CreateSignUpDto) {
    return this.authService.signUp(
      createSignUpDto.nickname!,
      createSignUpDto.password!,
      createSignUpDto.loginKey!
    )
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.loginKey!, loginDto.password!)
  }
}
