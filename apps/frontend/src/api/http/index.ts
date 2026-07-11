import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import router from '@/router/index'

const http = axios.create({
  baseURL: `/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器

http.interceptors.request.use(
  (config) => {
    const { state } = useAuthStore()
    const token = state.userToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器

http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { clearUserToken } = useAuthStore()
    const res = error.response.data
    if (!res) {
      ElMessage.error('网络连接失败')
    }
    const code = res.statusCode
    if (code === 401) {
      ElMessage.error('请重新登录')
      clearUserToken()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export { http }
