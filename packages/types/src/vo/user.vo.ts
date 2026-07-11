import type { UserRole, UserStatus, UserTerminal } from '../enum/user.enum'

export interface UserVO {
  id: number
  loginKey: string
  nickname: string
  avatar: string | null
  email: string | null
  status: UserStatus
  role: UserRole
  terminal?: UserTerminal | null
  createdAt: string
  updatedAt: string | null
}
