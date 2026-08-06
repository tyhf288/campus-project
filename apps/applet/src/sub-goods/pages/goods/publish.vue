<template>
  <!-- 表单区域 -->
  <uni-forms ref="formRef" :modelValue="form" :rules="rules" label-width="100rpx">
    <view class="form-section">
      <!-- 商品标题 -->
      <uni-forms-item label="标题" name="title" required>
        <uni-easyinput v-model="form.title" placeholder="请输入商品标题" :clearable="true" />
      </uni-forms-item>

      <!-- 商品价格 & 成色 -->
      <view class="form-row">
        <view class="form-col">
          <uni-forms-item label="价格" name="price" required>
            <view class="price-display">
              <uni-easyinput
                v-model="form.price"
                type="digit"
                placeholder="0.00"
                :clearable="false"
              />
              元
            </view>
          </uni-forms-item>
        </view>

        <view class="form-col">
          <uni-forms-item label="成色" name="quality" required :label-width="50">
            <uni-data-select
              v-model="form.quality"
              :localdata="qualityOptions"
              placeholder="成色选择"
            />
          </uni-forms-item>
        </view>
      </view>

      <!-- 分色选择 & 匿名选择 -->
      <view class="form-row">
        <view class="form-col">
          <uni-forms-item label="分类选择" name="category">
            <uni-data-select
              v-model="form.category"
              :localdata="categoryOptions"
              placeholder="教材选择"
            />
          </uni-forms-item>
        </view>

        <view class="form-col">
          <uni-forms-item label="是否匿名" name="anonymous">
            <uni-data-select
              v-model="form.anonymous"
              :localdata="[
                { value: 'true', text: '匿名' },
                { value: 'false', text: '不匿名' },
              ]"
              placeholder="请选择"
            />
          </uni-forms-item>
        </view>
      </view>

      <!-- 交易地点 -->
      <uni-forms-item label="交易地点" name="location">
        <uni-easyinput v-model="form.location" placeholder="请输入交易地点" :clearable="true" />
      </uni-forms-item>

      <!-- 商品描述 -->
      <uni-forms-item label="商品描述" name="description">
        <uni-easyinput
          v-model="form.description"
          type="textarea"
          placeholder="补充说明商品情况"
          :maxlength="500"
          :autoHeight="true"
        />
        <view class="word-count"> {{ (form.description || '').length }}/500 </view>
      </uni-forms-item>
    </view>
  </uni-forms>

  <!-- 底部提示 -->
  <view class="footer-tip">
    <!-- @ts-ignore -->
    <uni-icons type="info-filled" size="16" color="#FF9F5B"></uni-icons>
    <text class="tip-text">请如实描述，交易建议选择校内面交</text>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { GoodsQuality } from '@campus/types'
import { createGoods, getCategoryList } from '@/api/goods'
import { uploadToOss } from '@/utils/oss-upload'

/** 表单引用 */
const formRef = ref()

/** 表单数据 */
const form = reactive({
  title: '',
  price: '',
  quality: GoodsQuality.NORMAL,
  color: '',
  category: '',
  materials: '',
  location: '',
  description: '',
  anonymous: 'false',
})

/** 表单校验规则 */
const rules = {
  title: {
    rules: [{ required: true, errorMessage: '请输入商品标题' }],
  },
  price: {
    rules: [
      { required: true, errorMessage: '请输入价格' },
      {
        validateFunction: (
          rule: any,
          value: string,
          data: any,
          callback: (msg?: string) => void
        ) => {
          const price = Number(value)
          if (!value || isNaN(price) || price <= 0) {
            callback('请输入有效价格')
            return false
          }
          return true
        },
      },
    ],
  },
  quality: {
    rules: [{ required: true, errorMessage: '请选择成色' }],
  },
}

/** 成色选项（适配uni-data-select格式） */
const qualityOptions = [
  { value: GoodsQuality.NEW, text: '全新' },
  { value: GoodsQuality.ANEW, text: '几乎全新' },
  { value: GoodsQuality.NORMAL, text: '轻微使用' },
  { value: GoodsQuality.SLIGHT_USED, text: '七成新' },
  { value: GoodsQuality.OLD, text: '五成新' },
]

/** 分类选项 */
const categoryOptions = ref<Array<{ value: string; text: string }>>([])
onMounted(async () => {
  const res = await getCategoryList()
  // 将后端返回的分类数据转换为 uni-data-select 需要的格式
  categoryOptions.value = res.data.map((item: any) => ({
    value: String(item.id),
    text: item.name,
  }))
})

// ==================== 暴露给父组件的方法 ====================

/** 提交发布 */
async function submit(images: string[]) {
  // 使用uni-forms校验
  try {
    await formRef.value.validate()
  } catch (err) {
    return
  }

  // 额外校验
  if (images.length === 0) {
    return uni.showToast({ title: '请至少上传一张图片', icon: 'none' })
  }

  uni.showLoading({ title: '发布中...' })
  try {
    // 先上传图片获取 OSS URL
    const imageUrls: string[] = []
    for (const img of images) {
      uni.showLoading({ title: `上传图片 ${imageUrls.length + 1}/${images.length}` })
      const ossUrl = await uploadToOss(img, 'goods')
      imageUrls.push(ossUrl)
    }
    uni.hideLoading()

    // 调用创建商品接口
    await createGoods({
      title: form.title,
      description: form.description,
      price: Number(form.price),
      quality: form.quality,
      categoryId: form.category ? parseInt(form.category) : 1,
      images: imageUrls,
      anonymous: form.anonymous === 'true',
    })

    uni.showToast({ title: '发布成功', icon: 'success' })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e: any) {
    uni.hideLoading()
    uni.showToast({ title: e.message || '发布失败', icon: 'error' })
  }
}

// 暴露方法给父组件
defineExpose({
  submit,
})
</script>

<style scoped lang="scss">
/* ==================== 表单区域 ==================== */
.form-section {
  background-color: $bg-card;
  margin: $gap-sm $page-padding;
  border-radius: $radius-lg;
  padding: 32rpx;
}

.form-row {
  display: flex;
  gap: $gap-base;

  .form-col {
    flex: 1;
  }
}

/* 价格显示 */
.price-display {
  display: flex;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: $radius-base;
  padding: 0 $gap-base;

  .price-symbol {
    font-size: $font-size-lg;
    color: $color-orange;
    font-weight: $font-bold;
    margin-right: 4rpx;
  }
}

.word-count {
  text-align: right;
  font-size: $font-size-xs;
  color: $text-secondary;
  margin-top: 8rpx;
}

/* ==================== 底部提示 ==================== */
.footer-tip {
  margin: $gap-base $page-padding;
  padding: 24rpx;
  background-color: rgba(255, 159, 91, 0.1);
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $gap-xs;

  .tip-text {
    font-size: $font-size-sm;
    color: $color-orange;
    line-height: 1.6;
  }
}
</style>
