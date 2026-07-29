import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { OssService } from './oss.service'
import ossConfig from '../configs/oss.config'

@Module({
  imports: [ConfigModule.forFeature(ossConfig)],
  providers: [OssService],
  exports: [OssService], // 导出供其他模块使用
})
export class OssModule {}
