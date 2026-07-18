import { createSSRApp } from 'vue'
import App from './App.vue'
// 导入 HTTP 请求拦截器配置
import './api/http/config'

export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
  }
}
