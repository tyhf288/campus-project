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
        min-width="150"
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
      <el-table-column label="发布时间" align="center" width="170">
        <template v-slot="{ row }">{{ (row as GoodVO).createAt }}</template>
      </el-table-column>
      <el-table-column label="操作" width="140" align="center" fixed="right">
        <template v-slot="{ row }">
          <template v-if="(row as GoodVO).status === 'pending'">
            <!-- ===== 锁状态判断 ===== -->
            <template v-if="lockMap[(row as GoodVO).id]">
              <el-tooltip
                :content="`${lockMap[(row as GoodVO).id]?.acquiredByName} 正在审核中`"
                placement="top"
              >
                <el-button type="info" link disabled> 审核中 </el-button>
              </el-tooltip>
            </template>
            <el-button v-else type="primary" link @click="showAudit(row as GoodVO)">
              审核
            </el-button>
          </template>
          <el-button v-else type="primary" link @click="showAudit(row as GoodVO)"> 详情 </el-button>
        </template>
      </el-table-column>
    </template>
  </Table>

  <!-- 审核弹窗 -->
  <AuditDialog
    v-model="auditVisible"
    :goods-data="currentGoods"
    :loading="auditLoading"
    @confirm="handleAuditConfirm"
    @cancel="handleAuditCancel"
  />
</template>

<script setup lang="ts">
import Table from '@/components/Table/index.vue'
import AuditDialog from './AuditDialog.vue'
import type { GoodVO, GoodFilterGet, GoodAudit, AuditLockVO } from '@campus/types'
import {
  getGoodsList,
  auditGoods,
  acquireAuditLock,
  releaseAuditLock,
} from '@/api/goodsManage/goods'
import { getCategoryList } from '@/api/goodsManage/category'
import { formatDate } from '@campus/utils'
import { PermissionCode } from '@campus/types'
import type { CategoryVO } from '@campus/types'

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

const categoryList = ref<CategoryVO[]>([])

const dataList = ref<GoodVO[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const dateRange = ref<string[] | null>(null)

// 默认筛选待审核商品
const filter = ref<GoodFilterGet>({
  page: 1,
  pageSize: 10,
  title: null,
  status: 'pending',
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

const loadCategories = async () => {
  try {
    const res = await getCategoryList()
    categoryList.value = res.data || []
  } catch {
    // ignore
  }
}

const fetchData = async () => {
  try {
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
    }))
    total.value = result.total || 0
  } catch {
    // error handled
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
    status: 'pending',
    categoryId: null,
    startDate: null,
    endDate: null,
  }
  fetchData()
}

/**
 * 审核弹窗
 */
const auditVisible = ref(false)
const auditLoading = ref(false)
const currentGoods = ref<GoodVO | null>(null)
// ===== 锁状态缓存 =====
// key: goodsId, value: 锁持有者信息
const lockMap = ref<Record<number, AuditLockVO | null>>({})

/**
 * 打开审核弹窗（尝试获取锁）
 */
const showAudit = async (row: GoodVO) => {
  // 如果已锁定，不打开弹窗
  if (lockMap.value[row.id]) {
    ElMessage.warning(`商品正在被 ${lockMap.value[row.id]?.acquiredByName} 审核中`)
    return
  }

  // ★ 请求获取锁
  const result = await acquireAuditLock(row.id)
  const lockResult = result.data

  if (lockResult.acquired) {
    // 获取锁成功 → 打开弹窗
    currentGoods.value = row
    auditVisible.value = true
  } else {
    // 锁冲突 → 提示并记录
    ElMessage.warning(lockResult.message || '该商品正在被其他审核员审核')
    lockMap.value[row.id] = lockResult
  }
}

/**
 * 关闭审核弹窗（释放锁）
 */
const handleAuditCancel = async () => {
  auditVisible.value = false

  // ★ 释放锁
  if (currentGoods.value) {
    await releaseAuditLock(currentGoods.value.id)
    currentGoods.value = null
  }
}

/**
 * 审核完成（Service 层已自动释放锁，这里做兜底）
 */
const handleAuditConfirm = async (data: GoodAudit) => {
  if (!currentGoods.value) return
  auditLoading.value = true
  try {
    await auditGoods(currentGoods.value.id, data)
    const label = data.status === 'approved' ? '已通过' : '已驳回'
    ElMessage.success(`审核${label}`)
    auditVisible.value = false
    currentGoods.value = null
    fetchData()
  } catch {
    // error handled
  } finally {
    auditLoading.value = false
  }
}

onMounted(() => {
  loadCategories()
  fetchData()
})
</script>
