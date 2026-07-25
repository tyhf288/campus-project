import { SetMetadata } from '@nestjs/common'
import { PermissionCode } from '@campus/types'

/**
 * 权限装饰器-接口所需要的角色权限
 */
export const PERMISSION_KEY = 'permission'
export const Permission = (permissionCode: PermissionCode[]) => {
  return SetMetadata(PERMISSION_KEY, permissionCode)
}
