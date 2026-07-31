// 跨平台存储兼容
export const storage = {
  getItem: (key: string) => uni.getStorageSync(key),
  setItem: (key: string, val: any) => uni.setStorageSync(key, val),
  removeItem: (key: string) => uni.removeStorageSync(key),
}
