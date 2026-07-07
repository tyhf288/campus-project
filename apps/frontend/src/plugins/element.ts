import type { App } from "vue"
import { ElMessage, ElNotification, ElMessageBox } from "element-plus"

export default (app: App) => {
  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$notify = ElNotification
  app.config.globalProperties.$confirm = ElMessageBox.confirm
  app.config.globalProperties.$prompt = ElMessageBox.prompt
  app.config.globalProperties.$alert = ElMessageBox.alert
}
