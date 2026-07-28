import http from '@/api/http/index'
import type { BlackFilterGet, BlackCreate, BlackUpdate } from '@campus/types'

//获取黑名单列表
export const getList = async (blackFilterGet: BlackFilterGet) => {
  return await http.get('/blacks', {
    params: blackFilterGet,
  })
}

//拉入黑名单
export const createBlack = async (blackCreate: BlackCreate) => {
  return await http.post('/blacks', blackCreate)
}

//解封黑名单
export const updateBlack = async (blackUpdate: BlackUpdate) => {
  return await http.patch('/blacks', blackUpdate)
}
