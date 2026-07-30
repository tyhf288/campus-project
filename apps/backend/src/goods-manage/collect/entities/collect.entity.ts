import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity({ tableName: 'collect', schema: 'goodsManage' })
export class Collect {
  @PrimaryKey()
  id!: number

  // 收藏用户 ID (FK -> user.id)
  @Property({ type: 'bigint', fieldName: 'user_id' })
  userId: number

  // 收藏商品 ID (FK -> goods.id)
  @Property({ type: 'bigint', fieldName: 'goods_id' })
  goodsId: number

  // 收藏时间
  @Property({ type: 'timestamptz', defaultRaw: 'now()', fieldName: 'create_at' })
  createAt: Date = new Date()
}
