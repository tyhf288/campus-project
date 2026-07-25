import { UserRole, PermissionCode, ROLE_PERMISSIONS } from '@campus/types'

/**
 * 根据角色获取权限列表
 */
export function getPermissionsByRole(role: UserRole): PermissionCode[] {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * 检查角色是否拥有指定权限
 */
export function hasPermission(
  role: UserRole,
  permissionCode: PermissionCode | PermissionCode[]
): boolean {
  //获取角色权限列表
  const permission = getPermissionsByRole(role)

  //管理员拥有所有权限
  if (role === UserRole.ADMIN) {
    return true
  }

  //判断权限
  if (Array.isArray(permissionCode)) {
    return permissionCode.some((code) => permission.includes(code))
  } else {
    return permission.includes(permissionCode)
  }
}
