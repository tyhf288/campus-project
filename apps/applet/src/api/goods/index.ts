import http from '@/api/http/index'
import type { ApiResponse, GoodsCreate } from '@campus/types'

//发布商品
export function createGoods(data: GoodsCreate): Promise<ApiResponse> {
  return http.post('/goods', data)
}

//获取商品分类列表
export function getCategoryList() {
  return http.get('/category')
}
