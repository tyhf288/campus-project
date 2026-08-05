import http from '@/api/http/index'
import { appletLoginVO, tokenVO, ApiResponse } from '@campus/types'

// 登录
export function login(data: appletLoginVO): Promise<ApiResponse<tokenVO>> {
  return http.post('/auth/mobile/login', data)
}

//注册
export function register(data: appletLoginVO): Promise<ApiResponse<tokenVO>> {
  return http.post('/auth/mobile/register', data)
}

//检查token
export function checkToken(): Promise<ApiResponse<boolean>> {
  return http.get('/auth')
}
