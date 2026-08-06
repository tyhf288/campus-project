//商品状态
enum GoodsStatus {
  PENDING = 'pending', // 待审核
  APPROVED = 'approved', // 审核通过（正常在售）
  REJECTED = 'rejected', // 审核驳回
  RESERVED = 'reserved', // 已预定
  SOLD = 'sold', // 已售出
  OFFLINE = 'offline', // 手动下架
}

//商品质量
enum GoodsQuality {
  NEW = 'new', // 全新
  ANEW = 'anew', // 几乎全新
  NORMAL = 'normal', // 轻微使用
  SLIGHT_USED = 'slight_used', // 七成新
  OLD = 'old', // 五成新
}
export { GoodsStatus, GoodsQuality }
