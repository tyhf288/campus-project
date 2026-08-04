import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { OssService } from './oss.service'
import ossConfig from '../configs/oss.config'
import { OssController } from './oss.controller'

@Module({
  imports: [ConfigModule.forFeature(ossConfig)],
  controllers: [OssController],
  providers: [OssService],
  exports: [OssService], // 导出供其他模块使用
})
export class OssModule {}
