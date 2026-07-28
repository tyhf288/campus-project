// 通用分页
export type { PageQuery, PageResult } from './common/pagination'

// 通用响应格式
export type { ApiResponse } from './common/response'

// 枚举
export { UserRole, UserStatus, UserTerminal } from './enum/user.enum'

// VO 接口出参契约
export type { UserVO } from './vo/user.vo'

// 菜单相关类型|用户权限
export type { MenuItem } from './common/menu.ts'
export { ROLE_PERMISSIONS, PermissionCode } from './common/menu'

//登录注册
export type { loginVO, registerVO, tokenVO, appletLoginVO } from './vo/auth.vo'

//用户列表相关api
export type { UserFilterGet } from './api/user.api'

// 黑名单相关类型
export type { BlackCreate, BlackUpdate, BlackFilterGet } from './api/black.api'
export type { BlackVO } from './vo/black.vo'
