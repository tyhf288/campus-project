import { UserTerminal } from '@campus/types'

const baseUrl = import.meta.env.VITE_BASE_URL as string
const httpInterceptor = {
  invoke(args: UniNamespace.RequestOptions) {
    // request 触发前拼接 url
    args.url = baseUrl + args.url
    // 设置超时时间
    args.timeout = 10000

    args.header = {
      ...args.header,
      'Content-Type': 'application/json',
      // 终端类型
      terminal: UserTerminal.MINI_PROGRAM,
    }
    // 设置请求头
    const token = 111111 //待定
    if (token) {
      args.header.Authorization = `Bearer ${token}`
    }
  },
}
uni.addInterceptor('request', httpInterceptor)
