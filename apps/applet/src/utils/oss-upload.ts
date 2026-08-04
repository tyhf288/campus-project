interface OssSignature {
  accessKeyId: string
  policy: string
  signature: string
  dir: string
  host: string
  expire: number
}

/**
 * 获取 OSS 签名
 * @param dir - 上传目录前缀（如 avatars、uploads、goods）
 * @returns 签名数据
 */
export const getOssSignature = async (dir: string = 'uploads'): Promise<OssSignature> => {
  const res = await uni.request({
    url: '/oss/signature',
    method: 'GET',
    data: { dir },
  })

  // ✅ 响应拦截器已经提取了 data 字段，所以 res.data 就是实际的签名数据
  const result = res.data as any

  // 检查是否有错误
  if (!result || !result.accessKeyId) {
    throw new Error('获取签名失败')
  }

  return result as OssSignature
}

/**
 * 生成唯一文件名
 * @param originalName - 原始文件名
 * @returns 唯一文件名
 */
const generateFileName = (originalName: string): string => {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const ext = originalName.split('.').pop() || 'jpg'
  return `${timestamp}_${randomStr}.${ext}`
}

/**
 * 直传文件到 OSS
 * @param filePath - 本地文件路径
 * @param dir - 上传目录
 * @returns OSS 文件 URL
 */
export const uploadToOss = async (filePath: string, dir: string = 'uploads'): Promise<string> => {
  try {
    // 1. 获取签名
    const signature = await getOssSignature(dir)

    // 2. 检查签名是否过期
    if (Date.now() > signature.expire) {
      throw new Error('签名已过期，请重新获取')
    }

    // 3. 生成文件名
    const fileName = generateFileName(filePath.split('/').pop() || 'file.jpg')
    const key = `${signature.dir}/${fileName}`

    // 4. 上传到 OSS
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: signature.host,
        filePath,
        name: 'file',
        formData: {
          key,
          policy: signature.policy,
          OSSAccessKeyId: signature.accessKeyId,
          Signature: signature.signature,
          success_action_status: '200',
        },
        success: (res) => {
          if (res.statusCode === 200) {
            // 上传成功，返回文件 URL
            const fileUrl = `${signature.host}/${key}`
            resolve(fileUrl)
          } else {
            reject(new Error(`上传失败: ${res.statusCode}`))
          }
        },
        fail: (err) => {
          reject(err)
        },
      })
    })
  } catch (error) {
    console.error('OSS 上传失败:', error)
    throw error
  }
}
