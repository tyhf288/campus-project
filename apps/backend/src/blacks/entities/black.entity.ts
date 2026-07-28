import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

/**
 * 黑名单实体 - 对应数据库表 "blacklist"
 * 所属模块: 用户管理模块 (user-management)
 */
@Entity({ tableName: 'blacklist', schema: 'userManagement' })
export class Black {
  @PrimaryKey()
  id!: number

  /** 用户ID（逻辑外键，不建立数据库外键约束） */
  @Property({ type: 'int' })
  userId!: number

  /** 拉黑原因 */
  @Property({ length: 500 })
  reason!: string

  /** 操作人ID（管理员ID，逻辑外键） */
  @Property({ type: 'int' })
  operatorId!: number

  /** 拉黑时间 */
  @Property({ type: 'timestamptz', onCreate: () => new Date() })
  createdAt!: Date

  /** 计划解封时间（若为 null 表示永久封禁） */
  @Property({ type: 'timestamptz', nullable: true })
  unbannedAt: Date | null = null

  /** 解封操作人ID */
  @Property({ nullable: true })
  unbannedById: number | null = null

  /** 解封原因 */
  @Property({ length: 500, nullable: true })
  unbannedReason: string | null = null

  /** 实际解封执行时间 */
  @Property({ type: 'timestamptz', nullable: true })
  unbannedDate: Date | null = null
}
