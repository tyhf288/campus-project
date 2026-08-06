//发布商品
export interface GoodsCreate {
  // 商品标题
  title: string
  // 商品描述
  description: string
  // 售价（单位：元）
  price: number
  // 成色
  quality: string
  // 分类 ID
  categoryId: number | null
  // 商品图片 URL 数组
  images: string[]
  // 是否匿名
  anonymous?: boolean
  // 交易地点
  location?: string
  // 原价（可选）
  originalPrice?: number
}
