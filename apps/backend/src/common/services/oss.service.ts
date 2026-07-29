import { Injectable, Inject } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import OSS from 'ali-oss'
import ossConfig from '../configs/oss.config'

/**
 * OSS 服务类
 * 封装阿里云 OSS 的常用操作
 */
@Injectable()
export class OssService {
  private client: OSS

  constructor(
    @Inject(ossConfig.KEY)
    private config: ConfigType<typeof ossConfig>
  ) {
    // 初始化 OSS 客户端
    this.client = new OSS({
      region: this.config.region,
      accessKeyId: this.config.accessKeyId!,
      accessKeySecret: this.config.accessKeySecret!,
      bucket: this.config.bucket,
    })
  }

  /**
   * 上传文件到 OSS（服务端代理模式）
   * @param file - 文件 Buffer
   * @param fileName - 文件名（包含路径）
   * @returns OSS 文件完整 URL
   */
  async uploadFile(file: Buffer, fileName: string): Promise<string> {
    try {
      const result = await this.client.put(fileName, file)

      // 如果配置了 CDN，返回 CDN 地址
      if (this.config.cdnDomain) {
        return `${this.config.cdnDomain}/${fileName}`
      }

      // 否则返回 OSS 默认地址（强制使用 HTTPS）
      const url = result.url
      return url.replace('http://', 'https://')
    } catch (error) {
      throw new Error(`OSS 上传失败: ${error}`)
    }
  }

  /**
   * 生成唯一文件名
   * 格式: uploads/timestamp_randomString.ext
   * @param originalName - 原始文件名
   * @param dir - 目录前缀（默认 uploads）
   * @returns 唯一文件名
   */
  generateFileName(originalName: string, dir: string = 'uploads'): string {
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = originalName.split('.').pop()?.toLowerCase() || 'bin'
    return `${dir}/${timestamp}_${randomStr}.${ext}`
  }

  /**
   * 生成 OSS 直传签名（客户端直传模式）
   * @param dir - 上传目录前缀
   * @returns 签名信息对象
   */
  getSignature(dir: string = 'uploads') {
    const now = Date.now()
    const expire = this.config.signatureExpire // 默认 30 分钟

    // 构建 Policy 策略
    const policyText = {
      expiration: new Date(now + expire * 1000).toISOString(),
      conditions: [
        // 限制文件大小
        ['content-length-range', 0, this.config.directMaxSize],
        // 限制上传目录
        ['starts-with', '$key', dir + '/'],
      ],
    }

    // Base64 编码 Policy
    const policy = Buffer.from(JSON.stringify(policyText)).toString('base64')

    // 计算签名
    const signature = this.client.calculatePostSignature(policyText)

    // 构造 OSS Host
    const host = `https://${this.config.bucket}.${this.config.region}.aliyuncs.com`

    return {
      code: 200,
      message: 'success',
      data: {
        accessKeyId: this.config.accessKeyId,
        policy,
        signature,
        dir,
        host,
        expire: now + expire * 1000, // 过期时间戳
      },
    }
  }

  /**
   * 删除 OSS 文件
   * @param fileName - 文件名（包含路径）
   */
  async deleteFile(fileName: string): Promise<void> {
    try {
      await this.client.delete(fileName)
    } catch (error) {
      throw new Error(`OSS 删除失败: ${error}`)
    }
  }
}
