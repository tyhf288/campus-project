import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core'
import { UserRole, UserStatus, UserTerminal } from '@campus/types'
@Entity()
export class User {
  @PrimaryKey()
  id!: number

  /**
   * 登录账号
   * PC端管理员/审核员：管理员后台创建，唯一账号
   * 小程序学生：存储微信openid
   */
  @Property({ unique: true })
  loginKey: string // 登录标识

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
  avatar?: string

  /** 邮箱（PC管理员使用，学生可空） */
  @Property({ nullable: true })
  email?: string

  /** 用户状态 */
  @Enum(() => UserStatus)
  status: UserStatus = UserStatus.ACTIVE

  /** 用户角色 */
  @Enum(() => UserRole)
  role: UserRole = UserRole.STUDENT

  /** 注册终端来源 */
  @Enum(() => UserTerminal)
  terminal?: UserTerminal

  /** 创建时间 */
  @Property({ onCreate: () => new Date() })
  createdAt!: Date

  /** 更新时间 */
  @Property({ onUpdate: () => new Date(), nullable: true })
  updatedAt?: Date
}
