<template>
  <el-form ref="pullBlackForm" label-width="80px">
    <el-form-item label="拉黑用户">
      <el-input v-model="props.pullList.userNickname" disabled />
    </el-form-item>
    <el-form-item label="用户uid">
      <el-input v-model="props.pullList.userLoginKey" disabled />
    </el-form-item>

    <el-form-item label="操作人">
      <el-input v-model="props.pullList.operatorNickname" disabled placeholder="操作人" />
    </el-form-item>
    <el-form-item label="封禁时长">
      <el-select v-model="selectTime" placeholder="选择封禁时长" @change="handleTimeChange">
        <el-option label="永久封禁" :value="0"></el-option>
        <el-option label="5分钟" :value="5 * 60 * 1000"></el-option>
        <el-option label="半小时" :value="30 * 60 * 1000"></el-option>
        <el-option label="1天" :value="24 * 60 * 60 * 1000"></el-option>
        <el-option label="10天" :value="10 * 24 * 60 * 60 * 1000"></el-option>
        <el-option label="1个月" :value="30 * 24 * 60 * 60 * 1000"></el-option>
        <el-option label="3个月" :value="90 * 24 * 60 * 60 * 1000"></el-option>
        <el-option label="1年" :value="365 * 24 * 60 * 60 * 1000"></el-option>
        <el-option label="10年" :value="10 * 365 * 24 * 60 * 60 * 1000"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="拉黑原因">
      <el-input v-model="pullCreate.reason" type="textarea" :rows="10" placeholder="拉黑原因" />
    </el-form-item>

    <div class="pull-black-button">
      <el-button type="primary" @click="handleEmit">提交</el-button>
      <el-button @click="emit('closeDialog')">取消</el-button>
    </div>
  </el-form>
</template>
<script setup lang="ts">
import type { BlackCreate } from '@campus/types'

const pullBlackForm = ref()
// 封禁时长（毫秒）
const selectTime = ref<number>()

interface PullList {
  userId: number
  operatorId: number
  userNickname: string
  userLoginKey: string
  operatorNickname: string
}
const props = defineProps<{
  pullList: PullList
}>()

const emit = defineEmits<{
  pullBlackRequest: [params: BlackCreate]
  closeDialog: []
}>()

// 创建拉黑参数
const pullCreate = ref<BlackCreate>({
  userId: props.pullList.userId,
  reason: '',
  operatorId: props.pullList.operatorId,
  unbannedAt: null, // 默认为 null（永久封禁）
})

// 处理封禁时长变化
const handleTimeChange = (duration: number) => {
  if (duration === 0) {
    // 永久封禁
    pullCreate.value.unbannedAt = null
  } else {
    // 计算解封时间并转换为 ISO 8601 格式
    const unbannedAt = new Date(Date.now() + duration)
    pullCreate.value.unbannedAt = unbannedAt.toISOString()
  }
}

// 提交
const handleEmit = () => {
  emit('pullBlackRequest', pullCreate.value)
}
</script>
<style lang="scss" scoped>
.pull-black-button {
  text-align: right;
}
</style>
