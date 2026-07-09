import { OmitType, PartialType } from '@nestjs/swagger'
import { UserBaseDto } from './user.base.dto'

class UserWithoutIdDto extends OmitType(UserBaseDto, ['id']) {}
export class UpdateUserDto extends PartialType(PartialType(UserWithoutIdDto)) {}
