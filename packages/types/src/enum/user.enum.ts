/** 用户全局状态 */
export enum UserStatus {
  /** 正常启用 */
  ACTIVE = 'ACTIVE',
  /** 冻结禁用 */
  DISABLED = 'DISABLED',
}

/**
 * 用户角色
 * ADMIN/AUDITOR → PC管理后台（管理员手动创建，禁止自助注册）
 * STUDENT → 小程序端学生（微信登录自动创建）
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  AUDITOR = 'AUDITOR',
  STUDENT = 'STUDENT',
}

/** 注册终端来源 */
export enum UserTerminal {
  PC_ADMIN = 'PC_ADMIN',
  MINI_PROGRAM = 'MINI_PROGRAM',
}
