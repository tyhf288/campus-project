<template>
  <div class="container">
    <div>header</div>
    <section>
      <div class="block">
        <el-avatar :size="50" src="/login.png" />
      </div>
      <el-dropdown class="select">
        <span> {{ adminStore.state.user.nickname }} </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="outLogin()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </section>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

const outLogin = () => {
  const authStore = useAuthStore()
  authStore.logout()
  router.push('/login')
}
</script>
<style scoped lang="scss">
:deep(.el-tooltip__trigger:focus-visible) {
  outline: none;
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}
section {
  display: flex;
  align-items: center;
  gap: 10px;
  .select {
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    &:hover {
      color: #11ce00;
    }
  }
}
</style>
