import { ApiProperty } from '@nestjs/swagger'
import { IsInt, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'
import { BlackUpdate } from '@campus/types'

export class UpdateBlackDto implements BlackUpdate {
  @ApiProperty({ description: '解封ID', required: false })
  @IsInt()
  @Type(() => Number)
  id: number

  @ApiProperty({ description: '解封原因', required: false })
  @MaxLength(255)
  unbannedReason: string

  @ApiProperty({ description: '解封操作人ID', required: false })
  @IsInt()
  @Type(() => Number)
  unbannedById: number
}
