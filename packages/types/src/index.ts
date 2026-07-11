// 通用分页
export type { PageQuery, PageResult } from './common/pagination'

// 枚举
export { UserRole, UserStatus, UserTerminal } from './enum/user.enum'

// VO 接口出参契约
export type { UserVO } from './vo/user.vo'

// 菜单相关类型
export type { MenuItem, AdminRole } from './common/menu.ts'

//登录注册
export type { loginVO, registerVO, tokenVO } from './vo/auth.vo'
