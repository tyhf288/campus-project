<template>
  <div class="layout">
    <header><Header></Header></header>
    <main>
      <aside><Aside></Aside></aside>
      <div class="right">
        <nav><Nav></Nav></nav>
        <div class="content">
          <el-card style="max-width: 100%; height: 100%" shadow="never">
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component :is="Component" :key="$route.path"></component>
              </keep-alive>
            </router-view>
          </el-card>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import Aside from '@/layouts/aside/index.vue'
import Header from '@/layouts/header/index.vue'
import Nav from '@/layouts/nav/index.vue'
</script>
<style scoped lang="scss">
@use '../assets/style/variables.module.scss' as *;

.layout {
  display: flex;
  flex-direction: column;
  background-color: #f1f1f1;
  header {
    height: var(--header-height);
    background-color: #4972af;
  }
  main {
    display: flex;
    flex: 1;
    aside {
      background-color: #ffffff;
      box-shadow: 2px 0 4px 1px rgba(0, 0, 0, 0.1);
      :deep(.el-menu-vertical:not(.el-menu--collapse)) {
        width: var(--aside-width);
      }
    }
    .right {
      flex: 1;
      nav {
        height: var(--nav-height);
        background-color: #ffffff;
        box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.1);
      }
      .content {
        height: calc(100vh - var(--header-height) - var(--nav-height));
        padding: 15px 15px 20px 15px;
        .content-main {
          width: 100%;
          height: 100%;
          background-color: #ffffff;
        }
      }
    }
  }
}
</style>
