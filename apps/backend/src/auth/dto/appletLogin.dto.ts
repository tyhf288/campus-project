import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail } from 'class-validator'
import { appletLoginVO } from '@campus/types'

export class AppletLoginDto implements appletLoginVO {
  @ApiProperty({ description: '微信前端获取code' })
  @IsString()
  code: string

  @ApiProperty({ description: '微信昵称', required: false })
  @IsString()
  nickname: string

  @ApiProperty({ description: '微信头像', required: false })
  @IsString()
  avatar: string | null

  @ApiProperty({ description: '微信邮箱', required: false })
  @IsEmail()
  email: string | null
}
