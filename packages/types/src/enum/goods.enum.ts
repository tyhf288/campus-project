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
  NEW = 'new', // 全新未拆
  NORMAL = 'normal', // 九成新
  SLIGHT_USED = 'slight_used', // 轻微使用
  OLD = 'old', // 明显使用痕迹
}
export { GoodsStatus, GoodsQuality }
