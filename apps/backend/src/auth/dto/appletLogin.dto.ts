import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { appletLoginVO } from '@campus/types'

export class AppletLoginDto implements appletLoginVO {
  @ApiProperty({ description: '微信前端获取code', required: true })
  @IsString()
  code: string
}
