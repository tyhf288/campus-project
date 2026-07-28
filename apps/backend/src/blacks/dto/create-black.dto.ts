import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString, IsOptional, MinLength, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { BlackCreate } from '@campus/types'

export class CreateBlackDto implements BlackCreate {
  @ApiProperty({ description: '用户ID' })
  @IsInt()
  @Type(() => Number)
  userId: number

  @ApiProperty({ description: '拉黑原因' })
  @IsString()
  @MinLength(1)
  reason: string

  @ApiProperty({ description: '操作人ID（管理员ID）' })
  @IsInt()
  @Type(() => Number)
  operatorId: number

  @ApiProperty({
    description: '预计解封日期',
  })
  @IsString()
  @IsOptional()
  unbannedAt: string | null
}
