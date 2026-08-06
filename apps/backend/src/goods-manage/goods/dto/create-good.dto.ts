import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsInt,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  MaxLength,
  IsArray,
} from 'class-validator'
import { Type } from 'class-transformer'
import { GoodsCreate } from '@campus/types'

export class CreateGoodDto implements GoodsCreate {
  @ApiProperty({ description: '商品标题' })
  @IsString()
  @MaxLength(128)
  title: string

  @ApiProperty({ description: '商品描述' })
  @IsString()
  description: string

  @ApiProperty({ description: '售价（单位：元）' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number

  @ApiProperty({ description: '成色' })
  @IsString()
  quality: string

  @ApiProperty({ description: '分类 ID' })
  @IsInt()
  @Type(() => Number)
  categoryId: number

  @ApiProperty({ description: '商品图片 URL 数组', type: [String] })
  @IsArray()
  @IsString({ each: true })
  images: string[]

  @ApiPropertyOptional({ description: '是否匿名' })
  @IsOptional()
  @IsBoolean()
  anonymous?: boolean

  @ApiPropertyOptional({ description: '交易地点' })
  @IsOptional()
  @IsString()
  @MaxLength(128)
  location?: string

  @ApiPropertyOptional({ description: '原价（可选）' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  originalPrice?: number
}
