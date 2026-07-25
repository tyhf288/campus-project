import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import element from '@/plugins/element.ts'
import 'normalize.css'
import '@/assets/style/index.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { permissionDirective } from '@/directives/permission.ts'

const app = createApp(App)
const pinia = createPinia()
// 注册持久化插件
pinia.use(piniaPluginPersistedstate)
//注册自定义指令
app.directive('permission', permissionDirective)
app.use(router)
app.use(pinia)
app.use(element)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
