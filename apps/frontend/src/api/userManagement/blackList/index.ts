import http from '@/api/http/index'
import type { BlackFilterGet } from '@campus/types'

export const getList = async (blackFilterGet: BlackFilterGet) => {
  return await http.get('/blacks', {
    params: blackFilterGet,
  })
}
