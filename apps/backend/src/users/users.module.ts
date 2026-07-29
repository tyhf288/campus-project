import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User } from './entities/user.entity'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { OssModule } from '../common/services/oss.module'
import { UsersUploadController } from './users.upload.controller'

@Module({
  imports: [MikroOrmModule.forFeature([User]), OssModule],
  controllers: [UsersController, UsersUploadController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
