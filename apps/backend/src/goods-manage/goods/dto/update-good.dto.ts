import { PartialType } from '@nestjs/swagger'
import { CreateGoodDto } from './create-good.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNumber, IsBoolean, IsOptional, IsInt, Min, MaxLength } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateGoodDto extends PartialType(CreateGoodDto) {
  @ApiPropertyOptional({ description: '商品状态' })
  @IsOptional()
  @IsString()
  status?: string

  @ApiPropertyOptional({ description: '审核驳回原因' })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  rejectReason?: string

  @ApiPropertyOptional({ description: '是否置顶' })
  @IsOptional()
  @IsBoolean()
  isTop?: boolean
}
