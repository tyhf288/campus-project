import type { Directive, DirectiveBinding } from 'vue'
import { usePermissionStore } from '@/stores/permission'
import { PermissionCode } from '@campus/types'

const check = (el: HTMLElement, binding: DirectiveBinding) => {
  const permissionStore = usePermissionStore()
  const permissionCode = binding.value as PermissionCode | PermissionCode[]
  // 检查权限
  if (!permissionStore.checkPermission(permissionCode)) {
    // 无权限则移除元素
    el.style.display = 'none'
  } else {
    // 有权限则显示元素
    el.style.display = ''
  }
}

/**
 * 自定义指令：权限
 */
export const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    check(el, binding)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    check(el, binding)
  },
}
