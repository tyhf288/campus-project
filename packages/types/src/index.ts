// 通用分页
export type { PageQuery, PageResult } from './common/pagination'

// 通用响应格式
export type { ApiResponse } from './common/response'

// 菜单相关类型
export type { MenuItem } from './common/menu.ts'

//登录注册|用户权限
export type { loginVO, registerVO, tokenVO, appletLoginVO, appletRegisterVO } from './vo/auth.vo'
export { ROLE_PERMISSIONS, PermissionCode } from './common/menu'

//用户列表相关
export type { UserFilterGet, UserUpdate } from './api/user.api'
export { UserRole, UserStatus, UserTerminal } from './enum/user.enum'
export type { UserVO } from './vo/user.vo'

// 黑名单相关类型
export type { BlackCreate, BlackUpdate, BlackFilterGet } from './api/black.api'
export type { BlackVO } from './vo/black.vo'

//商品列表相关
export { GoodsStatus, GoodsQuality } from './enum/goods.enum'
