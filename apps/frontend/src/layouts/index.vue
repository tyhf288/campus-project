<template>
  <div class="layout">
    <aside><Aside></Aside></aside>
    <main>
      <header><Header></Header></header>
      <nav>nav</nav>
      <div class="content"><router-view></router-view></div>
    </main>
  </div>
</template>
<script setup lang="ts">
import Aside from "@/layouts/aside/index.vue"
import Header from "@/layouts/header/index.vue"
</script>
<style scoped lang="scss">
.layout {
  display: flex;
  aside {
    :deep(.el-menu-vertical:not(.el-menu--collapse)) {
      width: var(--aside-width);
    }
    background-color: rgb(167, 89, 89);
  }
  main {
    display: flex;
    flex-direction: column;
    flex: 1;

    header {
      height: var(--header-height);
      background-color: rgb(211, 203, 50);
    }
    nav {
      height: var(--nav-height);
      background-color: rgb(57, 175, 51);
    }
    .content {
      height: calc(100vh - var(--header-height) - var(--nav-height));
      background-color: rgb(51, 82, 166);
    }
  }
}
</style>
