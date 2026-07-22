<template>
  <div class="user-list" ref="userListRef">
    <header class="search-header">
      <el-form :inline="true">
        <slot name="form-item"></slot>
      </el-form>
    </header>
    <main class="table-container">
      <el-table
        border
        :data="props.list"
        style="width: 100%"
        :height="tableHeight"
        :stripe="true"
        size="large"
      >
        <slot name="table-item"></slot>
      </el-table>
    </main>
    <footer class="footer">
      <el-pagination
        :current-page="props.page"
        :page-size="props.pageSize"
        :page-sizes="[5, 10, 20, 50]"
        size="default"
        layout="total, sizes, prev, pager, next, jumper"
        :total="props.listTotal"
        @size-change="(value) => emit('handleSizeChange', value)"
        @current-change="(value) => emit('handleCurrentChange', value)"
      />
    </footer>
  </div>
</template>
<script setup lang="ts">
interface Props {
  list: Array<any>
  listTotal: number
  page: number
  pageSize: number
}
const props = withDefaults(defineProps<Props>(), {
  list: () => [],
  listTitle: () => 0,
  page: () => 1,
  pageSize: () => 5,
})
const emit = defineEmits(['handleSizeChange', 'handleCurrentChange'])

//计算table高度自适应
const tableHeight = ref()
const userListRef = ref()
const computeTableHeight = async () => {
  //等待dom渲染
  await nextTick()
  //获取计算相关的dom
  const ListDom = userListRef.value
  const searchDom = ListDom.querySelector('.search-header')
  const footerDom = ListDom.querySelector('.footer')

  if (!searchDom || !footerDom) return

  // 计算table高度 = 总高度 - 搜索框高度 - 底部高度-间距
  const totalHeight = ListDom.clientHeight
  const searchHeight = searchDom.clientHeight
  const footerHeight = footerDom.clientHeight
  const padding = 16
  tableHeight.value = totalHeight - searchHeight - footerHeight - padding
}

//监听dom变化
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  computeTableHeight() //组件加载完成时计算table高度
  //监听dom变化
  if (userListRef.value) {
    resizeObserver = new ResizeObserver(() => computeTableHeight())
    resizeObserver.observe(userListRef.value)
  }
})
onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>
<style lang="scss" scoped>
.user-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.table-container {
  flex: 1;
  background-color: #fff;
}
footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
}
</style>
