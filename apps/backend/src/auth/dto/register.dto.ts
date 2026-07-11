import { IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { registerVO } from '@campus/types'

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
  @IsString()
  @MinLength(6)
  password?: string
}
