<template>
  <el-dialog
    v-model="visible"
    title="解封用户"
    width="500"
    :close-on-click-modal="false"
    draggable
    :destroy-on-close="true"
  >
    <el-form :rules="formRules" label-width="100px">
      <el-form-item label="用户账号">
        <span>{{ blackData?.userLoginKey }}</span>
      </el-form-item>
      <el-form-item label="用户昵称">
        <span>{{ blackData?.userNickname }}</span>
      </el-form-item>
      <el-form-item label="解封原因" required prop="reason">
        <el-input
          v-model="reason"
          type="textarea"
          :rows="3"
          placeholder="请输入解封原因"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading"> 确认解封 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { BlackVO } from '@campus/types'

interface Props {
  modelValue: boolean
  blackData: BlackVO
  loading: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', data: string): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 解封原因
const formRules = reactive({
  reason: [{ required: true, message: '请输入解封原因', trigger: 'blur' }],
})
const reason = ref('')

const handleConfirm = () => {
  if (!reason.value) {
    ElMessage.warning('请输入解封原因')
    return
  }

  emit('confirm', reason.value)
}

const handleCancel = () => {
  reason.value = ''
  emit('cancel')
}
</script>
