import { ApiProperty } from '@nestjs/swagger'
import { UserRole, UserStatus, UserTerminal } from '@campus/types'
import type { UserVO } from '@campus/types'

export class UserBaseDto implements UserVO {
  @ApiProperty()
  id: number

  @ApiProperty({ description: '登录账号' })
  loginKey: string

  @ApiProperty({ description: '昵称' })
  nickname: string

  @ApiProperty({ description: '头像', nullable: true })
  avatar: string | null

  @ApiProperty({ description: '邮箱', nullable: true })
  email: string | null

  @ApiProperty({ enum: UserStatus, description: '用户状态' })
  status: UserStatus

  @ApiProperty({ enum: UserRole, description: '角色 ADMIN / AUDITOR / STUDENT' })
  role: UserRole

  @ApiProperty({ enum: UserTerminal, nullable: true, description: '注册终端' })
  terminal: UserTerminal | null

  @ApiProperty({ description: '创建时间' })
  createdAt: string

  @ApiProperty({ description: '更新时间', nullable: true })
  updatedAt: string | null
}
