import { IsBoolean, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class CreateTodoDto {
  @ApiProperty()
  @IsString()
  title!: string
  @ApiProperty()
  @IsString()
  content!: string
  @ApiProperty()
  @IsBoolean()
  isComplete!: boolean
}
