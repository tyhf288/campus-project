import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString, IsOptional, MinLength } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateBlackDto {
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
}
