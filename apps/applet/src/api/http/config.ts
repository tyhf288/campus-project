import { UserTerminal, ApiResponse } from '@campus/types'
import { useUserStore } from '@/stores/user'

const baseUrl = import.meta.env.VITE_API_BASE_URL as string
const httpInterceptor = {
  invoke(args: UniNamespace.RequestOptions) {
    // request 触发前拼接 url
    args.url = baseUrl + '/api' + args.url
    // 设置超时时间
    args.timeout = 10000

    args.header = {
      ...args.header,
      'Content-Type': 'application/json',
      // 终端类型
      terminal: UserTerminal.MINI_PROGRAM,
    }
    //设置请求头
    const userStore = useUserStore()
    const token = userStore.getToken() //待定
    if (token) {
      args.header.Authorization = `Bearer ${token}`
    }
  },
}

/**
 * 添加响应拦截器
 */
const responseInterceptor = {
  success(res: UniNamespace.RequestSuccessCallbackResult) {
    // 统一处理返回数据
    const { statusCode, data } = res
    const result = data as ApiResponse
    // 4xx/5xx 全部判定为请求失败，抛出异常
    if (statusCode < 200 || statusCode >= 300) {
      // 登录失效单独处理
      if (statusCode === 401) {
        uni.showToast({ title: '登录已失效，请重新登录', icon: 'none' })
        // 可开启跳转
        uni.navigateTo({ url: '/pages/login/login' })
      } else {
        // 取出后端返回的错误信息，没有则使用默认文案
        let msg = `请求错误 ${statusCode}`

        msg = result.message || msg
        uni.showToast({ title: msg, icon: 'none' })
        // 只 reject 简洁的错误信息，避免控制台打印冗长的响应对象
        return Promise.reject(new Error(msg))
      }
    }
    return Promise.resolve(result)
  },
  fail(err: UniNamespace.GeneralCallbackResult) {
    uni.showToast({ title: '网络请求失败', icon: 'none' })
    // 只 reject 简洁的错误信息
    return Promise.reject(new Error('网络请求失败'))
  },
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('request', responseInterceptor)
