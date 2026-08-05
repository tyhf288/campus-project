import http from '@/api/http/index'
import type { ApiResponse } from '@campus/types'

export interface CreateGoodsParams {
  title: string
  description: string
  price: number
  quality: string
  categoryId: number | null
  images: string[]
}

export function createGoods(data: CreateGoodsParams): Promise<ApiResponse<any>> {
  return http.post('/goods', data)
}
