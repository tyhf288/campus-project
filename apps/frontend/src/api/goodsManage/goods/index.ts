import http from '@/api/http/index'
import type {
  GoodFilterGet,
  GoodUpdate,
  GoodAudit,
  GoodVO,
  PageResult,
  AuditLockVO,
} from '@campus/types'

/**
 * 管理端：分页查询全部商品
 */
export const getGoodsList = (filter: GoodFilterGet) =>
  http.get<PageResult<GoodVO>>('/goods-all', { params: filter })

/**
 * 管理端：查询单个商品详情（含图片）
 */
export const getGoodsDetail = (id: number) => http.get<GoodVO>(`/goods-all/${id}`)

/**
 * 管理端：更新商品信息
 */
export const updateGoods = (id: number, data: GoodUpdate) => http.patch(`/goods-all/${id}`, data)

/**
 * 管理端：删除商品
 */
export const deleteGoods = (id: number) => http.delete(`/goods-all/${id}`)

/**
 * 审核商品（通过/驳回）
 */
export const auditGoods = (id: number, data: GoodAudit) =>
  http.patch(`/goods-all/${id}/audit`, data)

/**
 * 获取审核锁（打开弹窗时调用）
 */
export const acquireAuditLock = (goodsId: number) =>
  http.post<AuditLockVO>(`/goods-all/${goodsId}/lock`)

/**
 * 释放审核锁（关闭弹窗/审核完成时调用）
 */
export const releaseAuditLock = (goodsId: number) => http.delete(`/goods-all/${goodsId}/lock`)
