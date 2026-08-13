<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? '编辑分类' : '新增分类'"
    width="500"
    :close-on-click-modal="false"
    draggable
    destroy-on-close
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入分类名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="sort">
        <el-input-number
          v-model="formData.sort"
          :min="0"
          :step="1"
          placeholder="请输入排序值"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="启用状态">
        <el-switch v-model="formData.enable"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleConfirm"> 确认 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { CategoryVO, CategoryCreate, CategoryUpdate } from '@campus/types'

interface Props {
  modelValue: boolean
  isEdit: boolean
  categoryData?: CategoryVO | null
  loading: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', data: CategoryCreate | CategoryUpdate): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const formRef = ref()

const formRules = reactive({
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
})

const formData = reactive<CategoryCreate>({
  name: '',
  sort: 0,
  enable: true,
})

// 监听弹窗打开，回填编辑数据
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (props.isEdit && props.categoryData) {
        formData.name = props.categoryData.name
        formData.sort = props.categoryData.sort
        formData.enable = props.categoryData.enable
      } else {
        formData.name = ''
        formData.sort = 0
        formData.enable = true
      }
    }
  }
)

const handleConfirm = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  emit('confirm', { ...formData })
}

const handleCancel = () => {
  formRef.value?.resetFields()
  emit('cancel')
}

const handleClose = () => {
  formRef.value?.resetFields()
}
</script>
