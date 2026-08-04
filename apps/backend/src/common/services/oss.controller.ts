import { Controller, Get, Query } from '@nestjs/common'
import { OssService } from './oss.service'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { Public } from '../../auth/decorator/public.decorator'

/**
 * OSS 文件上传控制器
 *
 * 使用场景：
 * 1. 小程序注册时上传头像（无需 token）
 * 2. 发帖时上传图片（需要 token，但签名接口本身公开）
 */
@ApiTags('文件上传-OSS')
@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  /**
   * 获取 OSS 直传签名
   *
   * 说明：
   * - 此接口标记为 @Public()，允许未登录用户访问
   * - 前端获取签名后，直接上传到阿里云 OSS（客户端直传模式）
   *
   * 安全机制：
   * - 签名有效期：30分钟（可配置）
   * - 文件大小限制：10MB（可配置）
   * - 目录前缀限制：只能上传到指定目录
   *
   * @param dir - 上传目录前缀（默认 uploads）
   * @returns OSS 签名信息
   */
  @Get('signature')
  @Public() // ✅ 关键：标记为公开接口，无需 token
  @ApiOperation({ summary: '获取 OSS 直传签名' })
  @ApiQuery({
    name: 'dir',
    description: '上传目录前缀，如 avatars、uploads、goods',
    required: false,
    example: 'uploads',
  })
  getSignature(@Query('dir') dir: string = 'uploads') {
    return this.ossService.getSignature(dir)
  }
}
