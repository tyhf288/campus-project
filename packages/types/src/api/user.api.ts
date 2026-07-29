import { UserRole, UserStatus } from '../enum/user.enum'

//用户查询接口，可包含查询参数
export interface UserFilterGet {
  page: number
  pageSize: number
  nickname?: string
  email?: string
  role?: UserRole
  status?: UserStatus
}

// 用户更行数据接口
export interface UserUpdate {
  id: number
  nickname: string | null
  avatar: string | null
  email: string | null
}
