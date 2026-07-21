import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
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
  @Property({ onCreate: () => new Date() })
  createdAt!: Date

  /** 解封时间 */
  @Property({ nullable: true })
  unbannedAt: Date | null = null

  /** 解封操作人ID */
  @Property({ nullable: true })
  unbannedById: number | null = null

  /** 解封时间 */
  @Property({ nullable: true })
  unbannedDate: Date | null = null
}
