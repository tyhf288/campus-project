import http from '@/api/http/index'
import type { UserFilterGet, registerVO, UserUpdate } from '@campus/types'

export const getUserList = async (userFilterGet: UserFilterGet) => {
  return http.get('/users', { params: userFilterGet })
}

//创建用户

export const register = async (body: registerVO) => {
  return http.post('/auth/register', body)
}

//更新用户
export const updateUser = async (body: UserUpdate) => {
  return http.patch('/users', body)
}

/**
 * 上传头像到 OSS（代理模式）
 * @param file - 文件对象
 * @returns 上传结果
 */
export const uploadAvatar = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return http.post('/users/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
