import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateBlackDto {
  @ApiProperty({ description: '解封时间', required: false })
  @IsOptional()
  @IsDateString()
  unbannedAt?: Date | null

  @ApiProperty({ description: '解封操作人ID', required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  unbannedById?: number | null

  @ApiProperty({ description: '解封时间', required: false })
  @IsOptional()
  @IsDateString()
  unbannedDate?: Date | null
}
