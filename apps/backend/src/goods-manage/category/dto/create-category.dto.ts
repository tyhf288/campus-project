import { CategoryCreate } from '@campus/types'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsInt, IsBoolean, MaxLength, Min } from 'class-validator'

export class CreateCategoryDto implements CategoryCreate {
  @ApiProperty({ description: '分类名称' })
  @IsString()
  @MaxLength(255)
  name: string

  @ApiProperty({ description: '排序值（越大越靠前）' })
  @IsInt()
  @Min(0)
  sort: number

  @ApiProperty({ description: '是否启用' })
  @IsBoolean()
  enable: boolean
}
