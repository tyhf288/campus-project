/**
 * 商品图片 VO
 */
export interface ImageVO {
  /** 图片 ID */
  id: number
  /** 关联商品 ID */
  goodsId: number
  /** OSS 图片 URL */
  imageUrl: string | null
  /** 是否主图 */
  isMain: boolean
  /** 上传时间 */
  createAt: string
}

/**
 * 商品 VO（管理端列表/详情展示）
 */
export interface GoodVO {
  /** 商品 ID */
  id: number
  /** 发布者 ID */
  userId: number
  /** 是否匿名 */
  isAnonymous: boolean
  /** 分类 ID */
  categoryId: number
  /** 分类名称（关联查询） */
  categoryName?: string
  /** 商品标题 */
  title: string
  /** 商品描述 */
  desc: string
  /** 售价（单位：元） */
  price: number
  /** 成色 */
  quality: string
  /** 交易地点 */
  place: string | null
  /** 商品状态 */
  status: string
  /** 审核驳回原因 */
  rejectReason: string | null
  /** 浏览量 */
  viewCount: number
  /** 收藏数（冗余） */
  collectCount: number
  /** 留言数（冗余） */
  messageCount: number
  /** 是否置顶/推荐 */
  isTop: boolean
  /** 发布时间 */
  createAt: string
  /** 更新时间 */
  updateAt: string
  /** 商品图片列表 */
  images: ImageVO[]
}

/**
 * 分类 VO
 */
export interface CategoryVO {
  /** 分类 ID */
  id: number
  /** 分类名称 */
  name: string
  /** 排序值 */
  sort: number
  /** 是否启用 */
  enable: boolean
  /** 创建时间 */
  createAt: string
  /** 更新时间 */
  updateAt: string | null
}
/**
 * 审核锁信息
 */
export interface AuditLockVO {
  /** 是否成功获取锁 */
  acquired: boolean
  /** 锁持有者 ID */
  acquiredBy?: number
  /** 锁持有者名称 */
  acquiredByName?: string
  /** 获取锁的时间 */
  acquiredAt?: string
  /** 获取失败的原因（锁冲突时返回） */
  message?: string
}
