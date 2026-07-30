import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity({ tableName: 'image', schema: 'goodsManage' })
export class Image {
  @PrimaryKey()
  id!: number

  // 商品 ID (FK -> goods.id)
  @Property({ type: 'bigint', fieldName: 'goods_id' })
  goodsId: number

  // 对象存储图片地址
  @Property({ type: 'varchar', length: 512, fieldName: 'image_url' })
  imageUrl: string

  // 是否为主图 true=主图 false=普通图片
  @Property({ type: 'boolean', default: false, fieldName: 'is_main' })
  isMain!: boolean

  // 上传时间
  @Property({ type: 'timestamptz', defaultRaw: 'now()', fieldName: 'create_at' })
  createAt: Date = new Date()
}
