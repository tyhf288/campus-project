import { UserVO } from './user.vo'

export interface loginVO {
  loginKey: string
}

export interface registerVO {
  loginKey: string
  nickname: string
}

export interface tokenVO {
  access_token: string
  user: UserVO
}
