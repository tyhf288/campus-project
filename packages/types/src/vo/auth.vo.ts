import { UserVO } from './user.vo'

export interface loginVO {
  loginKey: string
}

export interface registerVO {
  loginKey: string
  nickname: string
}

export interface appletLoginVO {
  code: string
  nickname: string | null
  avatar: string | null
}

export interface tokenVO {
  access_token: string
  user: UserVO
}
