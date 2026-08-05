import { createSSRApp } from 'vue'
import App from './App.vue'
// 导入 HTTP 请求拦截器配置
import './api/http/config'
// 引入pinia
import { createPinia } from 'pinia'
// 持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// 引入路由守卫
import { setupRouteGuard } from '@/utils/routeGuard'

export function createApp() {
  const app = createSSRApp(App)
  //创建pinia实例
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)

  setupRouteGuard()

  return {
    app,
    pinia,
  }
}
