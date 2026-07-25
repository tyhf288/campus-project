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

    <el-form-item label="拉黑原因">
      <el-input v-model="pullCreate.reason" type="textarea" :rows="10" placeholder="拉黑原因" />
    </el-form-item>

    <div class="pull-black-button">
      <el-button type="primary" @click="emit('pullBlackRequest', pullCreate)">提交</el-button>
      <el-button @click="emit('closeDialog')">取消</el-button>
    </div>
  </el-form>
</template>
<script setup lang="ts">
import type { BlackCreate } from '@campus/types'

const pullBlackForm = ref()

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
//创建拉黑参数
const pullCreate = ref<BlackCreate>({
  userId: props.pullList.userId,
  reason: '',
  operatorId: props.pullList.operatorId,
})
</script>
<style lang="scss" scoped>
.pull-black-button {
  text-align: right;
}
</style>
