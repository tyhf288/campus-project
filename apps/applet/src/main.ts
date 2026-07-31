import { createSSRApp } from 'vue'
import App from './App.vue'
// 导入 HTTP 请求拦截器配置
import './api/http/config'
// 引入pinia
import { createPinia } from 'pinia'
// 持久化插件
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// uview-plus 全局样式
import 'uview-plus/index.scss'
// uview-plus 组件库
import uviewPlus from 'uview-plus'
export function createApp() {
  const app = createSSRApp(App)
  //创建pinia实例
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
  app.use(uviewPlus)

  return {
    app,
    pinia,
  }
}
