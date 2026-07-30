import { GoodsQuality, GoodsStatus } from '@campus/types'
import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core'

@Entity({ tableName: 'good', schema: 'goodsManage' })
export class Good {
  @PrimaryKey()
  id!: number

  // 发布者学生 ID (FK -> user.id)
  @Property({ type: 'bigint', fieldName: 'user_id' })
  userId: number
  //是否匿名
  @Property({ type: 'boolean', default: false, fieldName: 'is_anonymous' })
  isAnonymous: boolean

  // 所属分类 ID (FK -> goods_category.id)
  @Property({ type: 'bigint', fieldName: 'category_id' })
  categoryId: number

  // 商品标题
  @Property({ type: 'varchar', length: 128 })
  title: string

  // 商品详情描述
  @Property({ type: 'text' })
  desc: string

  // 售价（单位：元）
  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  // 原价（标价参考）
  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalPrice: number | null

  // 成色
  @Enum({ items: () => Object.values(GoodsQuality), fieldName: 'quality' })
  quality: GoodsQuality

  // 交易地点
  @Property({ type: 'varchar', length: 128, nullable: true, fieldName: 'place' })
  place: string | null

  // 商品状态
  @Enum({ items: () => Object.values(GoodsStatus), default: 'pending', fieldName: 'status' })
  status: GoodsStatus = GoodsStatus.PENDING

  // 审核驳回原因
  @Property({ type: 'varchar', length: 256, fieldName: 'reject_reason' })
  rejectReason: string

  // 浏览量
  @Property({ type: 'int', default: 0, fieldName: 'view_count' })
  viewCount: number = 0

  // 收藏人数（冗余字段）
  @Property({ type: 'int', default: 0, fieldName: 'collect_count' })
  collectCount: number = 0

  // 留言条数（冗余字段）
  @Property({ type: 'int', default: 0, fieldName: 'message_count' })
  messageCount: number = 0

  // 是否置顶推荐
  @Property({ type: 'boolean', default: false, fieldName: 'is_top' })
  isTop: boolean = false

  // 发布时间
  @Property({ type: 'timestamptz', defaultRaw: 'now()', fieldName: 'create_at' })
  createAt: Date = new Date()

  // 更新时间
  @Property({
    type: 'timestamptz',
    onUpdate: () => new Date(),
    fieldName: 'update_at',
  })
  updateAt: Date = new Date()
}
