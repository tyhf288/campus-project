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
      <el-form-item label="分类名称">
        <el-input clearable placeholder="请输入分类名称" v-model="searchName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">搜索</el-button>
        <el-button type="info" @click="resetSearch">重置</el-button>
        <el-button
          type="success"
          @click="showAddDialog"
          v-permission="[PermissionCode.SYSTEM_CONFIG]"
        >
          新增分类
        </el-button>
      </el-form-item>
    </template>

    <template #table-item>
      <el-table-column label="ID" prop="id" align="center" width="80" />
      <el-table-column
        label="分类名称"
        prop="name"
        align="center"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column label="排序" prop="sort" align="center" width="100" />
      <el-table-column label="启用状态" align="center" width="120">
        <template v-slot="{ row }">
          <el-switch
            :model-value="(row as CategoryVO).enable"
            @change="(val) => handleEnableChange(row as CategoryVO, Boolean(val))"
            v-permission="[PermissionCode.SYSTEM_CONFIG]"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createAt" align="center" width="180" />
      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template v-slot="{ row }">
          <el-button
            type="primary"
            link
            @click="showEditDialog(row as CategoryVO)"
            v-permission="[PermissionCode.SYSTEM_CONFIG]"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            link
            @click="handleDelete(row as CategoryVO)"
            v-permission="[PermissionCode.SYSTEM_CONFIG]"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </template>
  </Table>

  <!-- 新增/编辑分类弹窗 -->
  <CategoryDialog
    v-model="dialogVisible"
    :is-edit="isEdit"
    :category-data="currentCategory"
    :loading="dialogLoading"
    @confirm="handleDialogConfirm"
    @cancel="handleDialogCancel"
  />
</template>

<script setup lang="ts">
import Table from '@/components/Table/index.vue'
import CategoryDialog from './CategoryDialog.vue'
import type { CategoryVO, CategoryCreate, CategoryUpdate } from '@campus/types'
import {
  getCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/api/goodsManage/category'
import { formatDate } from '@campus/utils'
import { PermissionCode } from '@campus/types'

// 数据列表
const dataList = ref<CategoryVO[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const searchName = ref('')

/**
 * 处理每页条数改变
 */
const handleSizeChange = (val: number) => {
  pageSize.value = val
  page.value = 1
  fetchData()
}

/**
 * 处理页码改变
 */
const handleCurrentChange = (val: number) => {
  page.value = val
  fetchData()
}

/**
 * 获取数据
 */
const fetchData = async () => {
  try {
    const res = await getCategoryList()
    // 前端分页 + 搜索
    let list = res.data || []
    if (searchName.value) {
      list = list.filter((item: CategoryVO) => item.name.includes(searchName.value))
    }
    list.forEach((item: CategoryVO) => {
      item.createAt = formatDate(item.createAt, 'YYYY-MM-DD HH:mm:ss')
      item.updateAt = item.updateAt ? formatDate(item.updateAt, 'YYYY-MM-DD HH:mm:ss') : null
    })
    total.value = list.length
    // 手动分页
    const start = (page.value - 1) * pageSize.value
    dataList.value = list.slice(start, start + pageSize.value)
  } catch {
    // 错误已在拦截器中处理
  }
}

/**
 * 重置搜索
 */
const resetSearch = () => {
  searchName.value = ''
  page.value = 1
  pageSize.value = 10
  fetchData()
}

/**
 * 切换启用状态
 */
const handleEnableChange = async (row: CategoryVO, val: boolean) => {
  try {
    await updateCategory(row.id, { enable: val })
    row.enable = val
    ElMessage.success(val ? '已启用' : '已禁用')
  } catch {
    // 错误已在拦截器中处理
  }
}

/**
 * 新增/编辑弹窗
 */
const dialogVisible = ref(false)
const isEdit = ref(false)
const dialogLoading = ref(false)
const currentCategory = ref<CategoryVO | null>(null)

const showAddDialog = () => {
  isEdit.value = false
  currentCategory.value = null
  dialogVisible.value = true
}

const showEditDialog = (row: CategoryVO) => {
  isEdit.value = true
  currentCategory.value = { ...row }
  dialogVisible.value = true
}

const handleDialogConfirm = async (data: CategoryCreate | (CategoryUpdate & { id?: number })) => {
  dialogLoading.value = true
  try {
    if (isEdit.value && currentCategory.value) {
      await updateCategory(currentCategory.value.id, data as CategoryUpdate)
      ElMessage.success('更新成功')
    } else {
      await createCategory(data as CategoryCreate)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch {
    // 错误已在拦截器中处理
  } finally {
    dialogLoading.value = false
  }
}

const handleDialogCancel = () => {
  dialogVisible.value = false
}

/**
 * 删除分类
 */
const handleDelete = async (row: CategoryVO) => {
  try {
    await ElMessageBox.confirm(`确认删除分类「${row.name}」？`, '警告', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteCategory(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 用户取消或错误
  }
}

onMounted(() => {
  fetchData()
})
</script>
