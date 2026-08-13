// 发布商品（小程序端使用）
export interface GoodsCreate {
  // 商品标题
  title: string
  // 商品描述
  desc: string
  // 售价（单位：元）
  price: number
  // 成色
  quality: string
  // 分类 ID
  categoryId: number | null
  // 商品图片 URL 数组
  images: string[]
  // 是否匿名
  isAnonymous?: boolean
  // 交易地点
  place?: string
  // 原价（可选）
  originalPrice?: number
}

// ============== 以下为管理端接口类型 ==============

/**
 * 管理端商品筛选查询参数
 */
export interface GoodFilterGet {
  /** 页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 标题模糊搜索 */
  title?: string | null
  /** 商品状态筛选 */
  status?: string | null
  /** 分类 ID 筛选 */
  categoryId?: number | null
  /** 发布时间起始 */
  startDate?: string | null
  /** 发布时间截止 */
  endDate?: string | null
}

/**
 * 管理端更新商品参数
 */
export interface GoodUpdate {
  /** 商品标题 */
  title?: string
  /** 商品描述 */
  desc?: string
  /** 售价 */
  price?: number
  /** 成色 */
  quality?: string
  /** 分类 ID */
  categoryId?: number
  /** 交易地点 */
  place?: string
  /** 是否置顶 */
  isTop?: boolean
  /** 商品状态 */
  status?: string
  /** 驳回原因 */
  rejectReason?: string
}

/**
 * 审核操作参数
 */
export interface GoodAudit {
  /** 审核结果 */
  status: 'approved' | 'rejected'
  /** 驳回原因（驳回时必填） */
  rejectReason?: string
}

/**
 * 创建分类参数
 */
export interface CategoryCreate {
  /** 分类名称 */
  name: string
  /** 排序值（越大越靠前） */
  sort: number
  /** 是否启用 */
  enable: boolean
}

/**
 * 更新分类参数
 */
export interface CategoryUpdate {
  /** 分类名称 */
  name?: string
  /** 排序值 */
  sort?: number
  /** 是否启用 */
  enable?: boolean
}
