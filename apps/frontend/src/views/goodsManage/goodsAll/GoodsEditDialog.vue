<template>
  <el-dialog
    v-model="visible"
    :title="'编辑商品 — ' + (goodsData?.title || '')"
    width="600"
    :close-on-click-modal="false"
    draggable
    destroy-on-close
    @close="handleClose"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <el-form-item label="商品标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入商品标题"
          clearable
          maxlength="128"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="商品描述" prop="desc">
        <el-input
          v-model="formData.desc"
          type="textarea"
          :rows="3"
          placeholder="请输入商品描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="售价（元）" prop="price">
        <el-input-number
          v-model="formData.price"
          :min="0"
          :precision="2"
          :step="1"
          style="width: 200px"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="成色" prop="quality">
        <el-select v-model="formData.quality" placeholder="请选择成色" style="width: 200px">
          <el-option v-for="(item, key) in qualityOptions" :key="key" :label="item" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择分类" style="width: 200px">
          <el-option v-for="cat in categoryList" :key="cat.id" :label="cat.name" :value="cat.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="交易地点">
        <el-input
          v-model="formData.place"
          placeholder="请输入交易地点（选填）"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="置顶推荐">
        <el-switch v-model="formData.isTop"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleConfirm"> 保存 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { GoodVO, GoodUpdate, CategoryVO } from '@campus/types'

interface Props {
  modelValue: boolean
  goodsData?: GoodVO | null
  categoryList: CategoryVO[]
  loading: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', data: GoodUpdate): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const formRef = ref()

const qualityOptions: Record<string, string> = {
  new: '全新',
  anew: '几乎全新',
  normal: '轻微使用',
  slight_used: '七成新',
  old: '五成新',
}

const formRules = reactive({
  title: [{ required: true, message: '请输入商品标题', trigger: 'blur' }],
  price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
  quality: [{ required: true, message: '请选择成色', trigger: 'change' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
})

const formData = reactive<GoodUpdate>({
  title: '',
  desc: '',
  price: 0,
  quality: '',
  categoryId: undefined,
  place: '',
  isTop: false,
})

// 监听弹窗打开，回填数据
watch(
  () => props.modelValue,
  (val) => {
    if (val && props.goodsData) {
      formData.title = props.goodsData.title
      formData.desc = props.goodsData.desc
      formData.price = props.goodsData.price
      formData.quality = props.goodsData.quality
      formData.categoryId = props.goodsData.categoryId
      formData.place = props.goodsData.place || ''
      formData.isTop = props.goodsData.isTop
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
