import http from '@/api/http/index'
import { appletLoginVO } from '@campus/types'

// 登录
export function login(data: appletLoginVO) {
  return http.post('/auth/mobile/login', data)
}
