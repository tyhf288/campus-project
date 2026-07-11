import { http } from '@/api/http'
import type { loginVO } from '@campus/types'

export interface LoginParams extends loginVO {
  password: string
}

export const loginApi = async (req: LoginParams) => {
  return http.post('/auth/login', req)
}

export const profileApi = async () => {
  return http.get('/auth')
}
