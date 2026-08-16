import http from '@/api/http/index'
import type { ApiResponse, GoodsCreate, GoodVO, PageResult, GoodFilterGet } from '@campus/types'

//发布商品
export function createGoods(data: GoodsCreate): Promise<ApiResponse> {
  return http.post('/goods', data)
}

//获取商品分类列表
export function getCategoryList() {
  return http.get('/category')
}

/**
 * 分页获取商品列表
 * @param params - 查询参数（page/pageSize/status/categoryId）
 */
export function getGoodsList(params: GoodFilterGet): Promise<ApiResponse<PageResult<GoodVO>>> {
  // status/categoryId 为 null 或 undefined 时不传
  const query: Record<string, string | number> = {
    page: params.page,
    pageSize: params.pageSize,
  }
  if (params.title) query.title = params.title
  if (params.status) query.status = params.status
  if (params.categoryId) query.categoryId = params.categoryId

  return http.get<PageResult<GoodVO>>('/goods', { query })
}

//查找商品
export function findGoods(body: string) {
  return http.post(`/goods`, { data: body })
}
