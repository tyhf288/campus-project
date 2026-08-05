import http from '@/api/http/index'
import type { ApiResponse } from '@campus/types'

export interface CreatePostParams {
  title: string
  content: string
  category: string
  contact: string
  images: string[]
}

export function createPost(data: CreatePostParams): Promise<ApiResponse<any>> {
  return http.post('/wall/post', data)
}
