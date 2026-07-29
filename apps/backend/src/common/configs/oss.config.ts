import { registerAs } from '@nestjs/config'

/**
 * OSS 配置注册函数
 * 从环境变量读取 OSS 相关配置
 */
export default registerAs('oss', () => ({
  // OSS 区域 endpoint
  region: process.env.OSS_REGION,

  // AccessKey ID
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,

  // AccessKey Secret
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,

  // Bucket 名称
  bucket: process.env.OSS_BUCKET,

  // CDN 加速域名（可选）
  cdnDomain: process.env.OSS_CDN_DOMAIN || '',

  // 签名有效期（秒）
  signatureExpire: parseInt(process.env.OSS_SIGNATURE_EXPIRE || '1800', 10),

  // 代理上传最大文件大小（字节）
  proxyMaxSize: parseInt(process.env.PROXY_UPLOAD_MAX_SIZE || '5242880', 10),

  // 直传最大文件大小（字节）
  directMaxSize: parseInt(process.env.DIRECT_UPLOAD_MAX_SIZE || '10485760', 10),
}))
