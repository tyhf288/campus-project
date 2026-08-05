/**
 * 全局路由守卫
 * 简化版本：只负责检查 token，401 跳转交给响应拦截器处理
 */

import { checkToken } from '@/api/login'

// 白名单
const whiteList = ['/pages/index/index', '/pages/login/login', '/pages/mine/index']

// 判断页面是否需要拦截
const isNeedIntercept = (route: string): boolean => {
  // 提取路径（去掉参数部分）
  const path = route.split('?')[0]
  return !whiteList.includes(path)
}

// 路由拦截器
const routeInterceptor = {
  async invoke(options: UniApp.NavigateToOptions & { url?: string }) {
    const url = options.url

    // 如果 url 为空，直接阻止
    if (!url) {
      console.error('路由拦截器: url 参数为空')
      return false
    }

    // 目标页面需要登录验证
    if (isNeedIntercept(url)) {
      try {
        // 检查 token 是否有效
        await checkToken()
        // 如果 checkToken 成功返回，说明 token 有效，放行
        return true
      } catch (error) {
        // token 无效或网络错误，checkToken 会抛出异常
        // 响应拦截器会自动处理 401 并跳转到登录页
        return false // 阻止原跳转
      }
    }

    return true // 白名单页面，直接放行
  },
}

// 注册拦截器，只拦截 navigateTo 和 redirectTo
export function setupRouteGuard() {
  uni.addInterceptor('navigateTo', routeInterceptor)
  uni.addInterceptor('redirectTo', routeInterceptor)
}
