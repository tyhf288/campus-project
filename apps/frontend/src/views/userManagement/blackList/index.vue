<template>
  <Table
    :list="dataList"
    :list-total="total"
    :page="currentPage"
    :page-size="pageSize"
    @handle-size-change="handleSizeChange"
    @handle-current-change="handleCurrentChange"
  >
    <template #form-item>
      <!-- 搜索表单 -->
    </template>
    <template #table-item>
      <!-- 表格列定义 -->
      <el-table-column label="用户账号" prop="userLoginKey" align="center" min-width="120" />
      <el-table-column
        label="用户昵称"
        prop="userNickname"
        align="center"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        label="拉黑原因"
        prop="reason"
        align="center"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column label="操作人账号" prop="operatorLoginKey" align="center" min-width="120" />
      <el-table-column label="操作人昵称" prop="operatorNickname" align="center" min-width="120" />
      <el-table-column label="拉黑时间" prop="createdAt" align="center" width="180" />
      <el-table-column label="解封时间" prop="unbannedAt" align="center" width="180" />
      <el-table-column
        label="解封操作人账号"
        prop="unbannedByLoginKey"
        align="center"
        min-width="140"
      />
      <el-table-column
        label="解封操作人昵称"
        prop="unbannedNickname"
        align="center"
        min-width="145"
      />
      <el-table-column label="实际解封时间" prop="unbannedDate" align="center" width="180" />
    </template>
  </Table>
</template>

<script setup lang="ts">
import Table from '@/components/Table/index.vue'
import type { BlackFilterGet, BlackVO } from '@campus/types'
import { getList } from '@/api/userManagement/blackList'

// 请求参数
const blackFilterGet = ref<BlackFilterGet>({
  page: 1,
  pageSize: 10,
  userNickname: null,
  userLoginKey: null,
  operatorLoginKey: null,
})
// 数据列表
const dataList = ref<BlackVO[]>([])
// 数据总数
const total = ref(0)
// 当前页码
const currentPage = ref(1)
// 每页显示条数
const pageSize = ref(10)

/**
 * 处理每页条数改变
 * @param val - 新的每页条数
 */
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  fetchData()
}

/**
 * 处理页码改变
 * @param val - 新的页码
 */
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchData()
}

/**
 * 获取数据
 */
const fetchData = async () => {
  const res = await getList(blackFilterGet.value)
  dataList.value = res.data.list
  total.value = res.data.total
}

onMounted(() => {
  fetchData()
})
</script>
