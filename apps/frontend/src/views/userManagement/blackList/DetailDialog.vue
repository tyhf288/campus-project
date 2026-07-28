<template>
  <el-dialog
    v-model="visible"
    title="黑名单详情"
    width="600"
    :close-on-click-modal="false"
    draggable
    destroy-on-close
    @close="handleClose"
  >
    <el-descriptions :column="2" border v-if="blackData">
      <el-descriptions-item label="用户账号">{{ blackData.userLoginKey }}</el-descriptions-item>
      <el-descriptions-item label="用户昵称">{{ blackData.userNickname }}</el-descriptions-item>
      <el-descriptions-item label="拉黑原因" :span="2">{{ blackData.reason }}</el-descriptions-item>
      <el-descriptions-item label="操作人账号">{{
        blackData.operatorLoginKey
      }}</el-descriptions-item>
      <el-descriptions-item label="操作人昵称">{{
        blackData.operatorNickname
      }}</el-descriptions-item>
      <el-descriptions-item label="拉黑时间" :span="2">{{
        blackData.createdAt
      }}</el-descriptions-item>
      <el-descriptions-item label="预计解封时间" :span="2">{{
        blackData.unbannedAt || '永久封禁'
      }}</el-descriptions-item>
      <el-descriptions-item label="解封状态" :span="2">
        <el-tag v-if="blackData.unbannedDate" type="success">已解封</el-tag>
        <el-tag v-else type="danger">未解封</el-tag>
      </el-descriptions-item>
      <template v-if="blackData.unbannedDate">
        <el-descriptions-item label="解封操作人账号">{{
          blackData.unbannedByLoginKey
        }}</el-descriptions-item>
        <el-descriptions-item label="解封操作人昵称">{{
          blackData.unbannedNickname
        }}</el-descriptions-item>
        <el-descriptions-item label="解封原因" :span="2">{{
          blackData.unbannedReason
        }}</el-descriptions-item>
        <el-descriptions-item label="实际解封时间" :span="2">{{
          blackData.unbannedDate
        }}</el-descriptions-item>
      </template>
    </el-descriptions>
  </el-dialog>
</template>

<script setup lang="ts">
import type { BlackVO } from '@campus/types'

interface Props {
  modelValue: boolean
  blackData?: BlackVO | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const handleClose = () => {
  emit('close')
}
</script>
