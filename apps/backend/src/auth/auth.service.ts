import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { ConflictException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { tokenVO } from '@campus/types'

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService
  ) {}

  // 生成token
  private async generateToken(loginKey: string, id: number) {
    return {
      access_token: await this.jwtService.sign({
        loginKey,
        id,
      }),
    }
  }
  // 注册
  async signUp(
    nickname: string,
    password: string,
    loginKey: string
  ): Promise<{ access_token: string }> {
    const userD = await this.UsersService.findOne(loginKey)
    if (userD) {
      throw new ConflictException('用户已存在')
    }
    const hashPassword = await bcrypt.hash(password, 10)
    await this.UsersService.create({
      loginKey,
      nickname,
      password: hashPassword,
    })
    const user = await this.UsersService.findOne(loginKey)

    return this.generateToken(loginKey, user!.id)
  }

  // 登录
  async login(loginKey: string, password: string): Promise<tokenVO> {
    const user = await this.UsersService.findOne(loginKey)
    if (!user) {
      throw new ConflictException('用户不存在')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new ConflictException('密码错误')
    }

    return await this.generateToken(loginKey, user!.id)
  }
}
