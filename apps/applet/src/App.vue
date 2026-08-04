<script setup lang="ts"></script>

<template>
  <view class="container">
    <slot />
  </view>
</template>

<script setup lang="ts"></script>

<style lang="scss">
/* uview-plus 全局样式：必须在 App.vue 中引用（而非 main.ts import），
   避免每次增量编译触发 app.wxss 重写，导致微信工具重启 App 跳回首页 */
@import 'uview-plus/index.scss';

.container {
  width: 100%;
  height: 100%;
}
</style>
