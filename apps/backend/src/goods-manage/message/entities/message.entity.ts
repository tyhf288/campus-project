import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity({ tableName: 'message', schema: 'goodsManage' })
export class Message {
  @PrimaryKey()
  id!: number

  // 关联商品 ID (FK -> goods.id)
  @Property({ type: 'bigint', fieldName: 'goods_id' })
  goodsId: number

  // 留言人 ID (FK -> user.id)
  @Property({ type: 'bigint', fieldName: 'user_id' })
  userId: number

  // 回复上级留言 ID，一级留言为 null (FK -> self.id)
  @Property({ type: 'bigint', nullable: true, fieldName: 'parent_id' })
  parentId: number | null

  // 留言内容
  @Property({ type: 'text' })
  content: string

  // 留言时间
  @Property({ type: 'timestamptz', defaultRaw: 'now()', fieldName: 'create_at' })
  createAt: Date = new Date()
}
