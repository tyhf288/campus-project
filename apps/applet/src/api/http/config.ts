import { UserTerminal } from '@campus/types'

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
    // 设置请求头
    // const token = 111111 //待定
    // if (token) {
    //   args.header.Authorization = `Bearer ${token}`
    // }
  },
}

/**
 * 添加响应拦截器
 */
const responseInterceptor = {
  success(res: UniNamespace.RequestSuccessCallbackResult) {
    // 统一处理返回数据
    console.log('响应拦截器', res)
    const { statusCode, data } = res
    // token过期、401登录失效统一跳转登录页
    if (statusCode === 401) {
      uni.showToast({ title: '登录已失效，请重新登录', icon: 'none' })
      // uni.navigateTo({ url: '/pages/login/login' })
      return Promise.reject(res)
    }
    // 直接剥离外层包装，业务页面直接拿data
    return data
  },
  fail(err: UniNamespace.GeneralCallbackResult) {
    uni.showToast({ title: '网络请求失败', icon: 'none' })
    return Promise.reject(err)
  },
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('request', responseInterceptor)
