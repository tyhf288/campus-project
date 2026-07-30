import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsEmail, IsOptional } from 'class-validator'
import { appletLoginVO } from '@campus/types'

export class AppletLoginDto implements appletLoginVO {
  @ApiProperty({ description: '微信前端获取code', required: true })
  @IsString()
  code: string

  @ApiProperty({ description: '微信昵称', required: false })
  @IsOptional()
  @IsString()
  nickname: string

  @ApiProperty({ description: '微信头像', required: false, nullable: true })
  @IsOptional()
  @IsString()
  avatar: string | null

  @ApiProperty({ description: '微信邮箱', required: false, nullable: true })
  @IsOptional()
  @IsEmail()
  email: string | null
}
