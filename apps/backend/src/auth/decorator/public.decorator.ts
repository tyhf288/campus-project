import { SetMetadata } from '@nestjs/common'

/**
 * 忽略登录token校验
 */
export const PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(PUBLIC_KEY, true)
