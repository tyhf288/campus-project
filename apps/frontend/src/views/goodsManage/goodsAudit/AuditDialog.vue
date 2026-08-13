<template>
  <el-dialog
    v-model="visible"
    :title="goodsData?.status === 'pending' ? '商品审核' : '审核详情'"
    width="750"
    :close-on-click-modal="false"
    draggable
    destroy-on-close
    @close="handleClose"
  >
    <!-- 商品信息展示 -->
    <el-descriptions v-if="goodsData" :column="2" border>
      <el-descriptions-item label="商品 ID">{{ goodsData.id }}</el-descriptions-item>
      <el-descriptions-item label="发布者 ID">{{
        goodsData.isAnonymous ? '匿名' : goodsData.userId
      }}</el-descriptions-item>
      <el-descriptions-item label="商品标题" :span="2">{{ goodsData.title }}</el-descriptions-item>
      <el-descriptions-item label="售价">&yen;{{ goodsData.price }}</el-descriptions-item>
      <el-descriptions-item label="成色">
        <el-tag :type="qualityMap[goodsData.quality]?.type || 'info'" size="small">
          {{ qualityMap[goodsData.quality]?.label || goodsData.quality }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="商品状态">
        <el-tag :type="statusMap[goodsData.status]?.type || 'info'" size="small">
          {{ statusMap[goodsData.status]?.label || goodsData.status }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="分类">{{
        goodsData.categoryName || goodsData.categoryId
      }}</el-descriptions-item>
      <el-descriptions-item label="交易地点">{{
        goodsData.place || '未指定'
      }}</el-descriptions-item>
      <el-descriptions-item label="是否匿名">
        <el-tag :type="goodsData.isAnonymous ? 'warning' : 'info'" size="small">
          {{ goodsData.isAnonymous ? '是' : '否' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="浏览量">{{ goodsData.viewCount }}</el-descriptions-item>
      <el-descriptions-item label="收藏数">{{ goodsData.collectCount }}</el-descriptions-item>
      <el-descriptions-item label="留言数">{{ goodsData.messageCount }}</el-descriptions-item>
      <el-descriptions-item label="发布时间">{{ goodsData.createAt }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ goodsData.updateAt }}</el-descriptions-item>
      <el-descriptions-item
        v-if="goodsData.status === 'rejected' && goodsData.rejectReason"
        label="驳回原因"
        :span="2"
      >
        <span style="color: #f56c6c">{{ goodsData.rejectReason }}</span>
      </el-descriptions-item>
      <el-descriptions-item label="商品描述" :span="2">
        <div style="white-space: pre-wrap; max-height: 160px; overflow-y: auto">
          {{ goodsData.desc }}
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="商品图片" :span="2">
        <div
          v-if="goodsData.images && goodsData.images.length > 0"
          style="display: flex; flex-wrap: wrap; gap: 8px"
        >
          <el-image
            v-for="img in goodsData.images"
            :key="img.id"
            :src="img.imageUrl || undefined"
            :preview-src-list="goodsData.images.map((i) => (i.imageUrl ? i.imageUrl : ''))"
            style="width: 100px; height: 100px"
            fit="cover"
          />
        </div>
        <span v-else>暂无图片</span>
      </el-descriptions-item>
    </el-descriptions>

    <!-- 审核操作区（仅待审核状态显示） -->
    <div v-if="goodsData?.status === 'pending'" class="audit-actions">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="auto">
        <el-form-item v-if="showRejectReason" label="驳回原因" prop="rejectReason">
          <el-input
            v-model="formData.rejectReason"
            type="textarea"
            :rows="3"
            placeholder="请输入驳回原因"
            maxlength="256"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <template v-if="goodsData?.status === 'pending'">
        <el-button @click="handleRejectToggle">{{
          showRejectReason ? '取消驳回' : '驳回'
        }}</el-button>
        <el-button
          v-if="showRejectReason"
          type="danger"
          :loading="loading"
          @click="handleRejectConfirm"
        >
          确认驳回
        </el-button>
        <el-button type="success" :loading="loading" @click="handleApprove"> 审核通过 </el-button>
      </template>
      <el-button v-else @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { GoodVO, GoodAudit } from '@campus/types'
import { releaseAuditLock } from '@/api/goodsManage/goods'

interface Props {
  modelValue: boolean
  goodsData?: GoodVO | null
  loading: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', data: GoodAudit): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

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

const formRef = ref()
const showRejectReason = ref(false)

const formRules = reactive({
  rejectReason: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }],
})

const formData = reactive({
  rejectReason: '',
})

/**
 * 切换驳回原因输入框
 */
const handleRejectToggle = () => {
  showRejectReason.value = !showRejectReason.value
  if (!showRejectReason.value) {
    formData.rejectReason = ''
  }
}

/**
 * 审核通过
 */
const handleApprove = async () => {
  await ElMessageBox.confirm('确认审核通过该商品？', '审核通过', {
    confirmButtonText: '确认通过',
    cancelButtonText: '取消',
    type: 'warning',
  })
  emit('confirm', { status: 'approved' })
}

/**
 * 确认驳回
 */
const handleRejectConfirm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  emit('confirm', { status: 'rejected', rejectReason: formData.rejectReason })
}

/**
 * 关闭弹窗重置
 */
const handleClose = () => {
  showRejectReason.value = false
  formData.rejectReason = ''
  formRef.value?.resetFields()

  // ★ 释放锁
  if (props.goodsData) {
    releaseAuditLock(props.goodsData.id)
  }
}

// ★ 组件卸载时自动释放锁
onUnmounted(() => {
  if (props.goodsData) {
    releaseAuditLock(props.goodsData.id)
  }
})
</script>

<style lang="scss" scoped>
.audit-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}
</style>
