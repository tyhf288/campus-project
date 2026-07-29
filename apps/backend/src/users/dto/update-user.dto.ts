import { UserUpdate } from '@campus/types'
import { Type } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto implements UserUpdate {
  @ApiProperty({ description: '用户id', required: true })
  @IsNotEmpty({ message: '用户 ID 不能为空' })
  @IsNumber({}, { message: '用户 ID 必须是数字' })
  @Type(() => Number)
  id: number

  @ApiProperty({ description: '用户昵称', required: false })
  @IsOptional()
  @IsString()
  nickname: string | null

  @ApiProperty({ description: '用户头像', required: false })
  @IsOptional()
  avatar: string | null

  @ApiProperty({ description: '用户邮箱', required: false })
  @IsOptional()
  @IsEmail()
  email: string | null
}
