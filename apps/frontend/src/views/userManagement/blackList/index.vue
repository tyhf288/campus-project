<template>
  <Table
    :list="dataList"
    :list-total="total"
    :page="page"
    :page-size="pageSize"
    @handle-size-change="handleSizeChange"
    @handle-current-change="handleCurrentChange"
  >
    <template #form-item>
      <!-- 搜索表单 -->
      <el-form-item label="用户昵称">
        <el-input
          clearable
          placeholder="请输入用户昵称"
          v-model="blackFilterGet.userNickname"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户账号">
        <el-input
          clearable
          placeholder="请输入用户账号"
          v-model="blackFilterGet.userLoginKey"
        ></el-input>
      </el-form-item>
      <el-form-item label="操作人账号">
        <el-input
          clearable
          placeholder="请输入操作人账号"
          v-model="blackFilterGet.operatorLoginKey"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">搜索</el-button>
        <el-button type="info" @click="resetSearch">重置</el-button>
      </el-form-item>
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
      <el-table-column label="预计解封时间" prop="unbannedAt" align="center" width="180" />
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
      <el-table-column label="解封原因" prop="unbannedReason" align="center" min-width="200" />
      <el-table-column label="实际解封时间" prop="unbannedDate" align="center" width="180" />
      <el-table-column label="操作" width="180px" align="center" fixed="right">
        <template v-slot="{ row }">
          <el-button type="primary" link @click="showDetail(row as BlackVO)">详情</el-button>
          <el-button
            v-if="!(row as BlackVO).unbannedDate"
            type="success"
            link
            @click="showUnbanDialog(row as BlackVO)"
            v-permission="permissionCode"
          >
            解封
          </el-button>
        </template>
      </el-table-column>
    </template>
  </Table>

  <!-- 详情弹窗 -->
  <DetailDialog
    v-model="detailDialogVisible"
    :black-data="currentBlack"
    @close="currentBlack = null"
  />

  <!-- 解封弹窗 -->
  <UnbanDialog
    v-model="unbanDialogVisible"
    :black-data="currentBlack"
    :loading="unbanLoading"
    @confirm="handleUnban"
    @cancel="unbanDialogVisible = false"
  />
</template>

<script setup lang="ts">
import Table from '@/components/Table/index.vue'
import DetailDialog from './DetailDialog.vue'
import UnbanDialog from './UnbanDialog.vue'
import type { BlackFilterGet, BlackVO, BlackUpdate } from '@campus/types'
import { getList, updateBlack } from '@/api/userManagement/blackList'
import { formatDate } from '@campus/utils'
import { PermissionCode } from '@campus/types'
import { useAdminStore } from '@/stores/admin'

// 权限代码（使用拉黑审核员权限作为解封权限）
const permissionCode: PermissionCode[] = [PermissionCode.BLACKLIST_CREATE_AUDITOR]

// 数据列表
const dataList = ref<BlackVO[]>([])
// 数据总数
const total = ref(0)
// 当前页码
const page = ref(1)
// 每页显示条数
const pageSize = ref(10)
// 请求参数
const blackFilterGet = ref<BlackFilterGet>({
  page: 1,
  pageSize: 10,
  userNickname: null,
  userLoginKey: null,
  operatorLoginKey: null,
})

/**
 * 处理每页条数改变
 * @param val - 新的每页条数
 */
const handleSizeChange = (val: number) => {
  pageSize.value = val
  page.value = 1
  blackFilterGet.value.page = 1
  blackFilterGet.value.pageSize = val
  fetchData()
}

/**
 * 处理页码改变
 * @param val - 新的页码
 */
const handleCurrentChange = (val: number) => {
  page.value = val
  blackFilterGet.value.page = val
  fetchData()
}

/**
 * 获取数据
 */
const fetchData = async () => {
  const res = await getList(blackFilterGet.value)
  dataList.value = res.data.list
  dataList.value.forEach((item) => {
    item.createdAt = formatDate(item.createdAt, 'YYYY-MM-DD HH:mm:ss')
    item.unbannedAt = item.unbannedAt ? formatDate(item.unbannedAt, 'YYYY-MM-DD HH:mm:ss') : null
    item.unbannedDate = item.unbannedDate
      ? formatDate(item.unbannedDate, 'YYYY-MM-DD HH:mm:ss')
      : null
  })
  total.value = res.data.total
}

/**
 * 重置搜索条件
 */
const resetSearch = () => {
  page.value = 1
  pageSize.value = 10
  blackFilterGet.value = {
    page: 1,
    pageSize: 10,
    userNickname: null,
    userLoginKey: null,
    operatorLoginKey: null,
  }
  fetchData()
}

/**
 * 详情弹窗
 */
const detailDialogVisible = ref(false)
const currentBlack = ref()

const showDetail = (row: BlackVO) => {
  currentBlack.value = row
  detailDialogVisible.value = true
}

/**
 * 解封弹窗
 */
const unbanDialogVisible = ref(false)
const unbanLoading = ref(false)

const showUnbanDialog = (row: BlackVO) => {
  currentBlack.value = row
  unbanDialogVisible.value = true
}

/**
 * 执行解封
 */
const adminStore = useAdminStore()
const handleUnban = async (unbanData: string) => {
  if (!currentBlack.value) {
    ElMessage.error('数据异常')
    return
  }

  unbanLoading.value = true
  try {
    const updateData = {
      id: currentBlack.value.id,
      unbannedById: adminStore.state.user.id,
      unbannedReason: unbanData,
    }
    await updateBlack(updateData)
    ElMessage.success('解封成功')
    unbanDialogVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('解封失败')
  } finally {
    unbanLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
