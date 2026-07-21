<template>
  <div class="user-list">
    <header class="search-header">
      <el-form :inline="true">
        <el-form-item label="用户名">
          <el-input
            clearable
            placeholder="请输入用户名"
            v-model="userFilterGet.nickname"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input placeholder="请输入邮箱" clearable v-model="userFilterGet.email"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select placeholder="请选择角色" style="width: 140px" v-model="userFilterGet.role">
            <el-option
              v-for="item in roleDict"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select placeholder="请选择状态" style="width: 140px" v-model="userFilterGet.status">
            <el-option
              v-for="item in statusDict"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">搜索</el-button>
        </el-form-item>
      </el-form>
    </header>
    <main class="table-container">
      <el-table border style="width: 100%" :data="userList" height="100%">
        <el-table-column label="登录Key" prop="loginKey" />
        <el-table-column label="昵称" prop="nickname" />
        <el-table-column label="头像" prop="avatar" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="状态" prop="status" />
        <el-table-column label="角色" prop="role" />
        <el-table-column label="终端" prop="terminal" />
        <el-table-column label="创建时间" prop="createdAt" />
        <el-table-column label="更新时间" prop="updatedAt" />
      </el-table>
    </main>
    <footer>
      <el-pagination
        v-model:current-page="userFilterGet.page"
        v-model:page-size="userFilterGet.pageSize"
        :page-sizes="[5, 10, 20, 50]"
        size="default"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTitle"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </footer>
  </div>
</template>
<script setup lang="ts">
import { getUserList } from '@/api/userManagement/userList'
import type { UserFilterGet } from '@campus/types'
import { UserRole, UserStatus } from '@campus/types'

//请求参数
const userFilterGet = ref<UserFilterGet>({
  page: 1,
  pageSize: 10,
  nickname: '',
  email: '',
  role: undefined,
  status: undefined,
})

//角色字典
const roleDict = ref([
  {
    label: '管理员',
    value: UserRole.ADMIN,
  },
  {
    label: '审核员',
    value: UserRole.AUDITOR,
  },
  {
    label: '用户',
    value: UserRole.STUDENT,
  },
])
//状态字典
const statusDict = ref([
  {
    label: '正常',
    value: UserStatus.ACTIVE,
  },
  {
    label: '禁用',
    value: UserStatus.DISABLED,
  },
])

//获取用户列表
const userList = ref([])
const listTitle = ref()
const getList = async () => {
  const res = await getUserList(userFilterGet.value)
  console.log(res)
  userList.value = res.data.list
  listTitle.value = res.data.total
}

//更改每页条数
const handleSizeChange = (val: number) => {
  userFilterGet.value.pageSize = val
  getList()
}
//更改当前页码
const handleCurrentChange = (val: number) => {
  userFilterGet.value.page = val
  getList()
}

onMounted(() => {
  getList()
})
</script>
<style lang="css" scoped>
.user-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.table-container {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background-color: #fff;
}
footer {
  display: flex;
  justify-content: flex-end;
}
</style>
