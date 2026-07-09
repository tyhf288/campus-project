import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LoginDto {
  @ApiProperty({ description: '账号' })
  @IsString()
  username: string

  @ApiProperty({ description: '密码' })
  @IsString()
  password: string
}
