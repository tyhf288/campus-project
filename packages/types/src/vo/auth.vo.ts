import { UserVO } from './user.vo'
import { UserRole } from '../enum/user.enum'

export interface loginVO {
  loginKey: string
}

export interface registerVO {
  loginKey: string
  nickname: string
  avatar: string | null
  email: string | null
  role: UserRole
}

export interface appletLoginVO {
  code: string
  nickname: string
  avatar: string | null
  email: string | null
}

export interface tokenVO {
  access_token: string
  user: UserVO
}
