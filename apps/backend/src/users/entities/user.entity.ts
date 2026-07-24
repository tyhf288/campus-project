import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core'
import { UserRole, UserStatus, UserTerminal } from '@campus/types'

/**
 * 用户实体 - 对应数据库表 "user"
 * 所属模块: 用户认证模块 (auth)
 */
@Entity({ tableName: 'user', schema: 'userManagement' })
export class User {
  @PrimaryKey()
  id!: number

  //管理员账号|小程序uid
  @Property({ unique: true })
  loginKey!: string // 登录标识
  //小程序用户id，管理员为空
  @Property({ unique: true, nullable: true })
  openid: string | null = null

  /**
   * 密码哈希
   * ✅ PC后台账号【必填】
   * ✅ 小程序学生【允许null，微信免密登录】
   */
  @Property({ nullable: true })
  password?: string

  /** 用户昵称 */
  @Property()
  nickname!: string

  /** 头像 */
  @Property({ nullable: true })
  avatar: string | null = null

  /** 邮箱（PC管理员使用，学生可空） */
  @Property({ nullable: true })
  email: string | null = null

  /** 用户状态 */
  @Enum({ items: () => UserStatus })
  status: UserStatus = UserStatus.ACTIVE

  /** 用户角色 */
  @Enum({ items: () => UserRole })
  role: UserRole = UserRole.STUDENT

  /** 注册终端来源 */
  @Enum({ items: () => UserTerminal, nullable: true })
  terminal?: UserTerminal

  /** 创建时间 */
  @Property({ onCreate: () => new Date() })
  createdAt!: Date

  /** 更新时间 */
  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date
}
