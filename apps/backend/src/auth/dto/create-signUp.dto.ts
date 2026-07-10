import { PartialType, PickType } from '@nestjs/swagger'
import { UserBaseDto } from '../../users/dto/user.base.dto'
import { IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

// 第一层先剔除不需要字段,防止元数据读取不到
// class UserWithoutIdDto extends OmitType(UserBaseDto, ['id', 'createdAt', 'updatedAt']) {}
class UserWithoutIdDto extends PickType(UserBaseDto, ['nickname', 'loginKey']) {} //测试用例
// 第二层再全部字段可选
export class CreateSignUpDto extends PartialType(UserWithoutIdDto) {
  /**
   * 后台创建PC管理员/审核员时必须传入密码
   * 如果创建小程序学生账号，可以不传密码
   */
  @ApiProperty({ description: '登录密码,PC账号必填', required: false })
  @IsString()
  @MinLength(6)
  password?: string
}
