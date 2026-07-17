<template>
  <!--  头部 -->
  <view
    class="header"
    :style="{
      paddingTop: safeAreaInsets?.top + 'px',
    }"
  >
    <view class="logo"><text>校园墙</text></view>
    <view class="search">
      <SearchInput></SearchInput>
    </view>
  </view>
</template>
<script setup lang="ts">
import SearchInput from '@/components/searchInput/index.vue'
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>
<style lang="scss" scoped>
.header {
  .logo {
    color: $text-main;
    font-size: $font-size-lg;
    font-weight: $font-bold;
    font-family: fantasy;
  }
  .search {
    padding-top: $gap-lg;
    border-radius: $radius-base;
  }
}
</style>
