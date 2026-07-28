/**
 * 创建黑名单请求接口
 */
export interface BlackCreate {
  /** 用户ID */
  userId: number
  /** 拉黑原因 */
  reason: string
  /** 操作人ID（管理员ID） */
  operatorId: number
  /** 预计解封日期 */
  unbannedAt: string | null
}

/**
 * 更新黑名单请求接口
 */
export interface BlackUpdate {
  /** 黑名单ID */
  id: number
  /** 解封操作人ID */
  unbannedById: number
  /** 解封原因 */
  unbannedReason: string
}

/**
 * 黑名单查询参数接口
 */
export interface BlackFilterGet {
  /** 页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 用户ID */
  userId?: number
  /** 操作人ID */
  operatorId?: number
  /** 用户名称 */
  userNickname?: string | null
  /** 用户账号 */
  userLoginKey?: string | null
  /** 操作人账号 */
  operatorLoginKey?: string | null
}
