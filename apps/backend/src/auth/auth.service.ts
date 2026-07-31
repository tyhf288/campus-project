import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { ConflictException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { tokenVO, UserVO, UserRole, UserTerminal, appletRegisterVO } from '@campus/types'
import { User } from '../users/entities/user.entity'
import { WechatService } from './wechat.service'
import { EntityManager } from '@mikro-orm/postgresql'

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
    private WechatService: WechatService,
    private readonly em: EntityManager
  ) {}

  // 将 User 实体的时间转为字符串，去除账号密码
  private transformToUserVO(user: User): UserVO {
    const { password, loginKey, openid, ...rest } = user
    const vo = {
      ...rest,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
    } as UserVO
    return vo
  }

  // 生成token
  private async generateToken(loginKey: string, id: number, role: UserRole) {
    return {
      access_token: await this.jwtService.sign({
        loginKey,
        id,
        role,
      }),
    }
  }
  // pc注册
  async signUp(registerDto): Promise<tokenVO> {
    const userD = await this.UsersService.findOne(registerDto.loginKey)
    if (userD) {
      throw new ConflictException('用户已存在')
    }
    const hashPassword = await bcrypt.hash(registerDto.password, 10)
    //创建用户
    await this.UsersService.create({
      ...registerDto,
      password: hashPassword,
      //后端统一设置登录端
      terminal: UserTerminal.PC_ADMIN,
    })
    const user = await this.UsersService.findOne(registerDto.loginKey)
    const tokenData = await this.generateToken(registerDto.loginKey, user!.id, user!.role)

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
    const tokenData = await this.generateToken(loginKey, user!.id, user!.role)

    return { access_token: tokenData.access_token, user: this.transformToUserVO(user!) }
  }

  //小程序注册
  async appSignUp(appletRegisterDto: appletRegisterVO) {
    //小程序角色默认为学生
    const { code, nickname, avatar } = appletRegisterDto
    //获取微信openid
    const { openid } = await this.WechatService.code2Session(code)

    // 使用事务包裹整个注册流程，防止并发问题
    return await this.em.transactional(async (em) => {
      // 在事务内查询用户是否存在
      const user = await em.findOne(User, { openid })
      if (user) {
        throw new ConflictException('该微信账号已注册，请直接登录')
      }

      if (!user) {
        // 按照注册顺序生成uid：在事务内查询当前用户总数，确保原子性
        const totalUsers = await em.count(User)
        const nextId = totalUsers + 1
        // 生成格式为 U1000001, U10002... 的uid，便于后续查询
        const loginKey = `U${String(1000000 + nextId).padStart(7, '0')}`

        // 创建新用户（在同一事务中）
        const newUser = em.create(User, {
          openid,
          loginKey,
          nickname,
          avatar,
          role: UserRole.STUDENT,
          terminal: UserTerminal.MINI_PROGRAM,
        } as any)

        // 刷新到数据库
        await em.flush()

        // 返回token和用户信息
        return {
          access_token: await this.generateToken(openid, newUser.id, newUser.role),
          user: this.transformToUserVO(newUser),
        }
      }
    })
  }
  //小程序登录&&注册
  async appletLogin(appletLoginDto) {
    //小程序角色默认为学生
    const { code } = appletLoginDto
    //获取微信openid
    const { openid } = await this.WechatService.code2Session(code)

    // 在事务内查询用户是否存在
    const user = await this.em.findOne(User, { openid })

    if (user) {
      // 用户已存在，直接返回token
      return {
        access_token: await this.generateToken(openid, user.id, user.role),
        user: this.transformToUserVO(user),
      }
    }
    throw new ConflictException('用户未注册，请先完成注册')
  }
}
