vue
<template>
  <view>
    <!-- 修正1：styles 绑定正确的对象格式 + 颜色值加引号 -->
    <!-- 修正2：新增 custom-class 提升样式优先级 -->
    <uni-easyinput
      style="border-radius: 10px"
      prefixIcon="search"
      v-model="search"
      placeholder="搜索闲置、帖子、用户"
    ></uni-easyinput>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const search = ref('')
defineOptions({
  styleIsolation: 'shared',
})
</script>

<style scoped lang="scss"></style>
