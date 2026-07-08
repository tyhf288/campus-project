import { IsEnum, IsNumber, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class AllFilterTodoDto {
  @IsNumber()
  @Type(() => Number)
  page: number

  @IsNumber()
  @Type(() => Number)
  limit: number

  @IsOptional()
  @IsEnum({ asc: 'asc', desc: 'desc' })
  order?: 'asc' | 'desc'
}
