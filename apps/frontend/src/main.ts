import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import { createPinia } from "pinia"
import element from "@/plugins/element.ts"
import "normalize.css"
import "@/assets/style/index.scss"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.use(element)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount("#app")
