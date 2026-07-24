/**
 * 黑名单响应 VO 接口
 */
export interface BlackVO {
  /** 黑名单ID */
  id: number
  /** 用户账号（uid） */
  userLoginKey: string //返回字段联合查询出账号而不用id，便于客户端查看
  /** 用户名称 */
  userNickname: string
  /** 拉黑原因 */
  reason: string
  /** 操作人账号 */
  operatorLoginKey: string
  /** 操作人名称 */
  operatorNickname: string
  /** 拉黑时间 */
  createdAt: string
  /** 解封时间 */
  unbannedAt: string | null
  /** 解封操作人账号 */
  unbannedByLoginKey: number | null
  /** 解封操作人名称 */
  unbannedNickname: string | null
  /** 解封时间 */
  unbannedDate: string | null
}
