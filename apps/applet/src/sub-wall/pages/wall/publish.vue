<template>
  <!-- 表单区域 -->
  <uni-forms ref="formRef" :modelValue="form" :rules="rules" label-width="160rpx">
    <view class="form-section">
      <!-- 内容描述 -->
      <uni-forms-item label="内容描述" name="content" required>
        <uni-easyinput
          v-model="form.content"
          type="textarea"
          placeholder="请输入要发布的内容，描述尽量详细哦"
          :maxlength="500"
          :autoHeight="true"
        />
        <view class="word-count"> {{ (form.content || '').length }}/500 </view>
      </uni-forms-item>

      <!-- 联系方式 -->
      <uni-forms-item label="联系方式" name="contact" required>
        <uni-easyinput
          v-model="form.contact"
          placeholder="请输入微信 / QQ / 手机号，方便别人联系你"
          :clearable="true"
          :maxlength="50"
        />
      </uni-forms-item>
    </view>
  </uni-forms>

  <!-- 底部提示 -->
  <view class="footer-tip">
    <!-- @ts-ignore -->
    <uni-icons type="info-filled" size="16" color="#FF9F5B"></uni-icons>
    <text class="tip-text">请文明发言，遵守社区规范</text>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { createPost } from '@/api/wall'
import { uploadToOss } from '@/utils/oss-upload'

/** 表单引用 */
const formRef = ref()

/** 表单数据 */
const form = reactive({
  content: '',
  contact: '',
})

/** 表单校验规则 */
const rules = {
  content: {
    rules: [{ required: true, errorMessage: '请输入内容' }],
  },
  contact: {
    rules: [{ required: true, errorMessage: '请填写联系方式' }],
  },
}

// ==================== 暴露给父组件的方法 ====================

/** 提交发布 */
async function submit(images: string[]) {
  // 使用uni-forms校验
  try {
    await formRef.value.validate()
  } catch (err) {
    return
  }

  uni.showLoading({ title: '发布中...' })
  try {
    // 有图先上传获取 OSS URL
    let imageUrls: string[] = []
    if (images.length > 0) {
      for (const img of images) {
        uni.showLoading({ title: `上传图片 ${imageUrls.length + 1}/${images.length}` })
        const ossUrl = await uploadToOss(img, 'wall')
        imageUrls.push(ossUrl)
      }
      uni.hideLoading()
    }

    // 调用创建信息接口
    await createPost({
      title: form.content.slice(0, 30),
      content: form.content,
      category: '其他',
      contact: form.contact,
      images: imageUrls,
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
/* ==================== 图片上传区域 ==================== */
.section {
  padding: 32rpx $page-padding;
  margin-top: $gap-sm;

  .section-header {
    display: flex;
    align-items: center;
    margin-bottom: $gap-base;
    gap: $gap-xs;

    .section-title {
      font-size: $font-size-lg;
      font-weight: $font-bold;
      color: $text-main;
    }
  }
}

.image-scroll {
  white-space: nowrap;
}

.image-list {
  display: inline-flex;
  gap: $gap-sm;
  padding-right: $gap-sm;
}

.image-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  border-radius: $radius-base;
  overflow: hidden;
  flex-shrink: 0;

  .img {
    width: 100%;
    height: 100%;
  }

  .delete-btn {
    position: absolute;
    top: 0;
    right: 0;
    width: 48rpx;
    height: 48rpx;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0 $radius-base 0 $radius-base;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.add-image-btn {
  width: 200rpx;
  height: 200rpx;
  border-radius: $radius-base;
  background-color: $bg-card;
  border: 2rpx dashed $border-color;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ==================== 表单区域 ==================== */
.form-section {
  background-color: $bg-card;
  margin: $gap-sm $page-padding;
  border-radius: $radius-lg;
  padding: 32rpx;
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
