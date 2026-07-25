import { UserRole } from '../enum/user.enum'
interface MenuItem {
  path: string
  name: string
  component?: string
  meta: {
    title: string
    icon?: string
    roles: UserRole[]
  }
  children?: MenuItem[]
}

/**
 * 权限码
 */
export enum PermissionCode {
  // 用户管理
  USER_CREATE = 'user:create', //创建用户
  USER_DELETE = 'user:delete', //删除用户

  // 黑名单管理
  BLACKLIST_CREATE_STUDENT = 'blacklist:createStudent', //拉黑用户
  BLACKLIST_CREATE_AUDITOR = 'blacklist:createAuditor', //拉黑审核员

  // 商品管理
  GOODS_AUDIT = 'goods:audit',
  GOODS_DELETE = 'goods:delete',

  // 帖子管理
  POST_AUDIT = 'post:audit',
  POST_DELETE = 'post:delete',

  // 系统设置（仅管理员）
  SYSTEM_CONFIG = 'system:config',
  SENSITIVE_WORD = 'sensitive:manage',

  // 日志查看（仅管理员）
  LOG_VIEW = 'log:view',
}

/**
 * 角色与权限关系
 */
export const ROLE_PERMISSIONS: Record<UserRole, PermissionCode[]> = {
  [UserRole.ADMIN]: Object.values(PermissionCode), // 所有权限

  //审核员权限
  [UserRole.AUDITOR]: [PermissionCode.BLACKLIST_CREATE_STUDENT],

  //学生没有权限
  [UserRole.STUDENT]: [],
}

export type { MenuItem }
