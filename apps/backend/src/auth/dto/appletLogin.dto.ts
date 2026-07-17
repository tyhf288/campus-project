import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { appletLoginVO } from '@campus/types'

export class AppletLoginDto implements appletLoginVO {
  @ApiProperty({ description: '微信前端获取code' })
  @IsString()
  code: string

  @ApiProperty({ description: '微信昵称', required: false })
  @IsString()
  nickname: string | null

  @ApiProperty({ description: '微信头像', required: false })
  @IsString()
  avatar: string | null
}
