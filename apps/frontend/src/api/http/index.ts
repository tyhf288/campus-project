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
    // 解构后端统一响应格式 { code, message, data }
    const { code, message } = response.data

    // 根据业务状态码判断请求是否成功
    if (code === 200) {
      return response.data
    } else {
      // 业务逻辑错误
      ElMessage.error(message || '请求失败')
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    const { clearUserToken } = useAuthStore()

    // 网络错误或服务器错误
    if (!error.response) {
      ElMessage.error('网络连接失败')
      return Promise.reject(error)
    }

    const res = error.response.data
    const code = res.code || res.statusCode

    // 处理不同的错误状态码
    if (code === 401) {
      ElMessage.error('请重新登录')
      clearUserToken()
      router.push('/login')
    } else if (code === 403) {
      ElMessage.error('没有权限访问')
    } else if (code === 404) {
      ElMessage.error('请求的资源不存在')
    } else if (code >= 500) {
      ElMessage.error('服务器错误')
    } else {
      ElMessage.error(res.message || '请求失败')
    }

    return Promise.reject(error)
  }
)

export default http
