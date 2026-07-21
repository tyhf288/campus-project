import http from '@/api/http/index'
import type { UserFilterGet } from '@campus/types'

export const getUserList = async (userFilterGet: UserFilterGet) => {
  return http.get('/users', { params: userFilterGet })
}
