import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { ConflictException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { tokenVO, UserVO, UserRole } from '@campus/types'
import { User } from '../users/entities/user.entity'
import { WechatService } from './wechat.service'

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
    private WechatService: WechatService
  ) {}

  // 将 User 实体的时间转为字符串，去除密码
  private transformToUserVO(user: User): UserVO {
    const vo = {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
    }
    delete vo.password
    return vo
  }

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
    loginKey: string,
    role?: UserRole
  ): Promise<tokenVO> {
    const userD = await this.UsersService.findOne(loginKey)
    if (userD) {
      throw new ConflictException('用户已存在')
    }
    const hashPassword = await bcrypt.hash(password, 10)
    //创建用户
    await this.UsersService.create({
      loginKey,
      nickname,
      password: hashPassword,
      role: (role as UserRole) || undefined,
    })
    const user = await this.UsersService.findOne(loginKey)
    const tokenData = await this.generateToken(loginKey, user!.id)

    return { access_token: tokenData.access_token, user: this.transformToUserVO(user!) }
  }

  // pc登录
  async login(loginKey: string, password: string): Promise<tokenVO> {
    const user = await this.UsersService.findOne(loginKey)
    if (!user) {
      throw new ConflictException('用户不存在')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new ConflictException('密码错误')
    }
    const tokenData = await this.generateToken(loginKey, user!.id)

    return { access_token: tokenData.access_token, user: this.transformToUserVO(user!) }
  }

  //小程序登录
  async appletLogin(appletLoginDto) {
    const { code, nickname, avatar } = appletLoginDto
    //获取微信openid
    const { openid } = await this.WechatService.code2Session(code)
    //pc端和小程序端的账号统一为loginKey
    const loginKey = openid
    const user = await this.UsersService.findOne(loginKey)
  }
}
