<template>
  <div class="layout" ref="layoutRef">
    <header class="header"><Header></Header></header>
    <main>
      <aside>
        <el-scrollbar height="calc(100vh - var(--header-height))">
          <Aside ref="asideRef"></Aside>
        </el-scrollbar>
      </aside>
      <div class="right">
        <nav class="nav"><Nav></Nav></nav>
        <div class="content" :style="{ height: `${CardHeight}px`, width: `${CardWidth}px` }">
          <el-card style="width: 100%; height: 100%" shadow="never">
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
import { useAppStore } from '@/stores/app.ts'
const appStore = useAppStore()

const layoutRef = ref()
const asideRef = ref()
const CardHeight = ref()
const CardWidth = ref()
//自适应卡片
const computeCard = async () => {
  await nextTick()
  //获取节点
  const layoutDom = layoutRef.value
  const asideDom = asideRef.value
  const headerDom = layoutDom.querySelector('.header')
  const navDom = layoutDom.querySelector('.nav')

  if (!headerDom || !navDom) return

  //计算高度
  const layoutHeight = layoutDom.offsetHeight
  const layoutWidth = layoutDom.offsetWidth
  const headerHeight = headerDom.offsetHeight
  const navHeight = navDom.offsetHeight
  //折叠菜单的宽度
  const asideWidth = appStore.isCollapse ? 64 : 210

  //高度
  CardHeight.value = layoutHeight - headerHeight - navHeight
  //宽度
  CardWidth.value = layoutWidth - asideWidth
}

watch(
  () => appStore.isCollapse,
  () => {
    // el-menu 有过渡动画，等待DOM渲染完成
    nextTick(() => computeCard())
  },
  { flush: 'post' }
)

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  computeCard() //组件加载完成时计算table高度
  if (layoutRef.value) {
    resizeObserver = new ResizeObserver(() => computeCard())
    resizeObserver.observe(layoutRef.value)
  }
})
onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>
<style scoped lang="scss">
@use '../assets/style/variables.module.scss' as *;

.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f1f1f1;
  --aside-width: #{$aside-width};

  header {
    height: var(--header-height);
    background-color: #4972af;
  }
  main {
    display: flex;
    flex: 1;
    overflow: hidden;
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
