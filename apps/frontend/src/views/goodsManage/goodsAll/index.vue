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
      <el-form-item label="商品标题">
        <el-input clearable placeholder="请输入商品标题" v-model="filter.title"></el-input>
      </el-form-item>
      <el-form-item label="商品状态">
        <el-select clearable placeholder="全部状态" v-model="filter.status" style="width: 140px">
          <el-option label="全部" value="" />
          <el-option v-for="(item, key) in statusMap" :key="key" :label="item.label" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品分类">
        <el-select
          clearable
          placeholder="全部分类"
          v-model="filter.categoryId"
          style="width: 140px"
        >
          <el-option label="全部" value="" />
          <el-option v-for="cat in categoryList" :key="cat.id" :label="cat.name" :value="cat.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 260px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData">搜索</el-button>
        <el-button type="info" @click="resetSearch">重置</el-button>
      </el-form-item>
    </template>

    <template #table-item>
      <el-table-column label="ID" prop="id" align="center" width="70" />
      <el-table-column
        label="商品标题"
        prop="title"
        align="center"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column label="价格" align="center" width="100">
        <template v-slot="{ row }">&yen;{{ (row as GoodVO).price }}</template>
      </el-table-column>
      <el-table-column label="成色" align="center" width="100">
        <template v-slot="{ row }">
          <el-tag :type="qualityMap[(row as GoodVO).quality]?.type || 'info'" size="small">
            {{ qualityMap[(row as GoodVO).quality]?.label || (row as GoodVO).quality }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="90">
        <template v-slot="{ row }">
          <el-tag :type="statusMap[(row as GoodVO).status]?.type || 'info'" size="small">
            {{ statusMap[(row as GoodVO).status]?.label || (row as GoodVO).status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center" width="100">
        <template v-slot="{ row }">{{ (row as GoodVO).categoryName || '-' }}</template>
      </el-table-column>
      <el-table-column label="浏览量" prop="viewCount" align="center" width="80" />
      <el-table-column label="收藏" prop="collectCount" align="center" width="70" />
      <el-table-column label="置顶" align="center" width="70">
        <template v-slot="{ row }">
          <el-switch
            :model-value="(row as GoodVO).isTop"
            @change="(val) => handleTopChange(row as GoodVO, Boolean(val))"
            v-permission="[PermissionCode.GOODS_AUDIT]"
            size="small"
          />
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" width="170">
        <template v-slot="{ row }">{{ (row as GoodVO).createAt }}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template v-slot="{ row }">
          <el-button type="primary" link @click="showDetail(row as GoodVO)">详情</el-button>
          <el-button
            type="success"
            link
            @click="showEdit(row as GoodVO)"
            v-permission="[PermissionCode.GOODS_AUDIT]"
            >编辑</el-button
          >
          <el-button
            type="danger"
            link
            @click="handleDelete(row as GoodVO)"
            v-permission="[PermissionCode.GOODS_AUDIT]"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </template>
  </Table>

  <!-- 商品详情弹窗 -->
  <GoodsDetailDialog v-model="detailVisible" :goods-data="currentGoods" />

  <!-- 编辑商品弹窗 -->
  <GoodsEditDialog
    v-model="editVisible"
    :goods-data="currentGoods"
    :category-list="categoryList"
    :loading="editLoading"
    @confirm="handleEditConfirm"
    @cancel="editVisible = false"
  />
</template>

<script setup lang="ts">
import Table from '@/components/Table/index.vue'
import GoodsDetailDialog from './GoodsDetailDialog.vue'
import GoodsEditDialog from './GoodsEditDialog.vue'
import type { GoodVO, GoodFilterGet, GoodUpdate, CategoryVO } from '@campus/types'
import { getGoodsList, updateGoods, deleteGoods } from '@/api/goodsManage/goods'
import { getCategoryList } from '@/api/goodsManage/category'
import { formatDate } from '@campus/utils'
import { PermissionCode } from '@campus/types'

// 成色映射
const qualityMap: Record<
  string,
  { label: string; type: 'warning' | 'info' | 'primary' | 'success' | 'danger' }
> = {
  new: { label: '全新', type: 'success' },
  anew: { label: '几乎全新', type: 'success' },
  normal: { label: '轻微使用', type: 'warning' },
  slight_used: { label: '七成新', type: 'warning' },
  old: { label: '五成新', type: 'danger' },
}

// 状态映射
const statusMap: Record<
  string,
  { label: string; type: 'warning' | 'info' | 'primary' | 'success' | 'danger' }
> = {
  pending: { label: '待审核', type: 'warning' },
  approved: { label: '已上架', type: 'success' },
  rejected: { label: '已驳回', type: 'danger' },
  reserved: { label: '已预定', type: 'info' },
  sold: { label: '已售出', type: 'primary' },
  offline: { label: '已下架', type: 'info' },
}

// 分类列表（用于筛选和编辑）
const categoryList = ref<CategoryVO[]>([])

// 数据
const dataList = ref<GoodVO[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const dateRange = ref<string[] | null>(null)

const filter = ref<GoodFilterGet>({
  page: 1,
  pageSize: 10,
  title: null,
  status: null,
  categoryId: null,
  startDate: null,
  endDate: null,
})

const handleSizeChange = (val: number) => {
  pageSize.value = val
  page.value = 1
  filter.value.page = 1
  filter.value.pageSize = val
  fetchData()
}

const handleCurrentChange = (val: number) => {
  page.value = val
  filter.value.page = val
  fetchData()
}

/**
 * 获取分类列表（用于筛选下拉）
 */
const loadCategories = async () => {
  try {
    const res = await getCategoryList()
    categoryList.value = res.data || []
  } catch {
    // ignore
  }
}

/**
 * 获取商品列表
 */
const fetchData = async () => {
  try {
    // 处理日期范围
    if (dateRange.value && dateRange.value.length === 2) {
      filter.value.startDate = dateRange.value[0]
      filter.value.endDate = dateRange.value[1]
    } else {
      filter.value.startDate = null
      filter.value.endDate = null
    }

    const res = await getGoodsList(filter.value)
    const result = res.data
    dataList.value = (result.list || []).map((item: GoodVO) => ({
      ...item,
      createAt: item.createAt ? formatDate(item.createAt, 'YYYY-MM-DD HH:mm:ss') : '',
      updateAt: item.updateAt ? formatDate(item.updateAt, 'YYYY-MM-DD HH:mm:ss') : '',
    }))
    total.value = result.total || 0
  } catch {
    // 错误已在拦截器中处理
  }
}

const searchData = () => {
  page.value = 1
  filter.value.page = 1
  fetchData()
}

const resetSearch = () => {
  page.value = 1
  pageSize.value = 10
  dateRange.value = null
  filter.value = {
    page: 1,
    pageSize: 10,
    title: null,
    status: null,
    categoryId: null,
    startDate: null,
    endDate: null,
  }
  fetchData()
}

/**
 * 置顶切换
 */
const handleTopChange = async (row: GoodVO, val: boolean) => {
  try {
    await updateGoods(row.id, { isTop: val })
    row.isTop = val
    ElMessage.success(val ? '已置顶' : '已取消置顶')
  } catch {
    // error handled
  }
}

/**
 * 详情弹窗
 */
const detailVisible = ref(false)
const currentGoods = ref<GoodVO | null>(null)

const showDetail = (row: GoodVO) => {
  currentGoods.value = row
  detailVisible.value = true
}

/**
 * 编辑弹窗
 */
const editVisible = ref(false)
const editLoading = ref(false)

const showEdit = (row: GoodVO) => {
  currentGoods.value = row
  editVisible.value = true
}

const handleEditConfirm = async (data: GoodUpdate) => {
  if (!currentGoods.value) return
  editLoading.value = true
  try {
    await updateGoods(currentGoods.value.id, data)
    ElMessage.success('更新成功')
    editVisible.value = false
    fetchData()
  } catch {
    // error handled
  } finally {
    editLoading.value = false
  }
}

/**
 * 删除商品
 */
const handleDelete = async (row: GoodVO) => {
  try {
    await ElMessageBox.confirm(`确认删除商品「${row.title}」？此操作不可恢复！`, '警告', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteGoods(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch {
    // 用户取消或错误
  }
}

onMounted(() => {
  loadCategories()
  fetchData()
})
</script>
