import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

/**
 * 商品分类表
 */
@Entity({ tableName: 'category', schema: 'goodsManage' })
export class Category {
  @PrimaryKey()
  id: number
  @Property({ type: 'string' })
  name: string
  // 排序字段(权重)
  @Property({ type: 'int' })
  sort: number
  // 开启状态
  @Property({ type: 'boolean' })
  enable: boolean
  // 创建时间
  @Property({ type: 'timestamptz', onCreate: () => new Date() })
  createAt: Date
  // 更新时间
  @Property({ type: 'timestamptz', onUpdate: () => new Date(), nullable: true })
  updateAt: Date | null = null
}
