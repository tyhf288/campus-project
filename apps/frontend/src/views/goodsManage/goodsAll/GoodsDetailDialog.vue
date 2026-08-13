<template>
  <el-dialog
    v-model="visible"
    title="商品详情"
    width="750"
    :close-on-click-modal="false"
    draggable
    destroy-on-close
  >
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
      <el-descriptions-item label="是否置顶">
        <el-tag :type="goodsData.isTop ? 'success' : 'info'" size="small">
          {{ goodsData.isTop ? '是' : '否' }}
        </el-tag>
      </el-descriptions-item>
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
        <div style="white-space: pre-wrap; max-height: 200px; overflow-y: auto">
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
  </el-dialog>
</template>

<script setup lang="ts">
import type { GoodVO } from '@campus/types'

interface Props {
  modelValue: boolean
  goodsData?: GoodVO | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const qualityMap: Record<
  string,
  { label: string; type: 'success' | 'warning' | 'danger' | 'info' | 'primary' }
> = {
  new: { label: '全新', type: 'success' },
  anew: { label: '几乎全新', type: 'success' },
  normal: { label: '轻微使用', type: 'warning' },
  slight_used: { label: '七成新', type: 'warning' },
  old: { label: '五成新', type: 'danger' },
}

const statusMap: Record<
  string,
  { label: string; type: 'success' | 'warning' | 'danger' | 'info' | 'primary' }
> = {
  pending: { label: '待审核', type: 'warning' },
  approved: { label: '已上架', type: 'success' },
  rejected: { label: '已驳回', type: 'danger' },
  reserved: { label: '已预定', type: 'info' },
  sold: { label: '已售出', type: 'primary' },
  offline: { label: '已下架', type: 'info' },
}
</script>
