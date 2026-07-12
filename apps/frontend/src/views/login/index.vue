<template>
  <div class="login-container">
    <el-card style="width: 480px; background-color: #ffffff80">
      <div class="title">
        <span>校园墙管理后台</span>
      </div>

      <el-form ref="formRef" :model="form">
        <el-form-item prop="loginKey">
          <el-input v-model="form.loginKey" type="text" placeholder="请输入账号" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button color="#626aef" @click="handleLogin" style="width: 500px">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { loginApi } from '@/api/auth'
import type { LoginParams } from '@/api/auth'
import type { tokenVO } from '@campus/types'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { ElMessage } from 'element-plus'

const router = useRouter()

const form = ref<LoginParams>({
  loginKey: '',
  password: '',
})
const formRef = ref<typeof form>()

const { setUserToken } = useAuthStore()
const { setMenu, setAdmin } = useAdminStore()
const handleLogin = async () => {
  const req = {
    loginKey: form.value.loginKey,
    password: form.value.password,
  }
  try {
    const response = await loginApi(req)
    const res: tokenVO = response.data

    if (res) {
      setUserToken(res.access_token)
      setAdmin(res.user)
      setMenu()
      ElMessage.success('登录成功')
      router.push('/')
    }
  } catch (err: any) {
    ElMessage.error(err.message)
  }
}
</script>
<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('/login.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover; /* 自动铺满屏幕，不变形 */
  .title {
    margin-bottom: 20px;
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    color: #303133;
    letter-spacing: 2px;
  }
}
</style>
