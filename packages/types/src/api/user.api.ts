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
