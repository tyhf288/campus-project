import { IsString, MinLength, IsEmail, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { registerVO, UserRole } from '@campus/types'
import { Transform } from 'class-transformer'

export class RegisterDto implements registerVO {
  /**
   * 后台创建PC管理员/审核员时必须传入密码
   * 如果创建小程序学生账号，可以不传密码
   */
  @ApiProperty({ description: '登录账号', required: true })
  @IsString()
  loginKey: string

  @ApiProperty({ description: '昵称', required: true })
  @IsString()
  nickname: string

  @ApiProperty({ description: '登录密码,PC账号必填', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string

  @ApiProperty({ description: '用户头像', required: false, type: String, nullable: true })
  @IsOptional()
  @IsString()
  avatar: string | null = null

  @ApiProperty({ description: '用户邮箱', required: false, type: String, nullable: true })
  @IsOptional()
  @IsEmail()
  email: string | null = null

  @ApiProperty({ description: '用户角色', required: true })
  @IsString()
  @Transform(({ value }) => {
    if (value && Object.values(UserRole).includes(value)) {
      return value as UserRole
    }
    return UserRole.AUDITOR
  })
  role: UserRole
}
