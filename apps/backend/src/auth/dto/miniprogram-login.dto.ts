import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class MiniProgramLoginDto {
  @ApiProperty({ description: '微信前端获取code' })
  @IsString()
  code: string

  @ApiProperty({ description: '微信昵称', required: false })
  nickname?: string

  @ApiProperty({ description: '微信头像', required: false })
  avatar?: string
}
