import { Factory } from '@mikro-orm/seeder'
import { faker } from '@faker-js/faker'
import { Good } from '../goods-manage/goods/entities/good.entity'
import { GoodsQuality, GoodsStatus } from '@campus/types'

/**
 * 校园二手商品标题池（贴合校园交易场景）
 */
const GOODS_TITLES = [
  '高等数学同济第七版',
  '大学英语四级真题集',
  '考研英语词汇书',
  'iPhone 13 128G 国行',
  '小米 20000mAh 充电宝',
  '罗技 G304 无线鼠标',
  '机械键盘 87 键',
  '蓝牙耳机 AirPods',
  'LED 护眼台灯',
  '电热水壶 1.5L',
  '二手自行车 26 寸',
  '斯伯丁篮球',
  '加厚瑜伽垫',
  '木吉他 41 寸',
  '相机三脚架',
  '24 寸 2K 显示器',
  'ThinkPad 笔记本电脑',
  'iPad 平板电脑',
  'WiFi 6 路由器',
  '宿舍收纳箱大号',
]

/**
 * 描述前缀池
 */
const DESC_PREFIXES = [
  '几乎全新，仅用过几次',
  '功能完好，外观无损',
  '毕业出清，低价转让',
  '闲置不用，便宜出',
  '质量很好，急用钱出售',
  '自用半年，保存良好',
  '开学季闲置，成色新',
  '换新出旧，正常使用痕迹',
]

/**
 * 描述后缀池
 */
const DESC_SUFFIXES = [
  '支持当面验货交易',
  '可小刀，非诚勿扰',
  '校内面交优先',
  '附赠原装配件',
  '有意者私聊看图',
  '不包邮，自提优先',
  '诚心出，接受议价',
]

/**
 * 校园交易地点池
 */
const TRADE_PLACES = [
  '东门',
  '图书馆门口',
  '一号宿舍楼下',
  '食堂门口',
  '体育馆',
  '教学楼 A 栋',
  '操场南门',
]

/**
 * 商品模拟数据工厂
 *
 * ⚠️ 外键约束说明：
 * - `userId` 引用 `userManagement.user` 表，随机范围 1~20，运行前需确保存在这些用户
 * - `categoryId` 引用 `goodsManage.category` 表，随机范围 1~8，运行前需确保存在这些分类
 *
 * 本工厂仅用于「新增」商品模拟数据，不删除任何现有数据。
 */
export class GoodsFactory extends Factory<Good> {
  model = Good

  definition(): Partial<Good> {
    // 成色随机
    const quality = faker.helpers.arrayElement(Object.values(GoodsQuality))
    // 状态：大部分在售，少量待审核（模拟刚发布）
    const status: GoodsStatus = faker.helpers.arrayElement([
      GoodsStatus.APPROVED,
      GoodsStatus.APPROVED,
      GoodsStatus.APPROVED,
      GoodsStatus.APPROVED,
      GoodsStatus.PENDING,
    ])

    return {
      // 发布者：随机引用 1~20 号学生用户
      userId: faker.number.int({ min: 1, max: 10 }),
      // 是否匿名（30% 概率）
      isAnonymous: faker.datatype.boolean(),
      // 所属分类：随机引用 1~8 号分类
      categoryId: faker.number.int({ min: 1, max: 2 }),
      // 标题
      title: faker.helpers.arrayElement(GOODS_TITLES),
      // 描述：前缀 + 后缀组合成完整描述
      desc: `${faker.helpers.arrayElement(DESC_PREFIXES)}，${faker.helpers.arrayElement(DESC_SUFFIXES)}`,
      // 售价：5 ~ 5000 元，保留两位小数（decimal(10,2)）
      price: Number(faker.number.float({ min: 5, max: 5000, fractionDigits: 2 }).toFixed(2)),
      // 成色
      quality,
      // 交易地点
      place: faker.helpers.arrayElement(TRADE_PLACES),
      // 商品状态
      status,
      // 审核驳回原因（模拟数据均为在售/待审核，无驳回，故恒为 null）
      rejectReason: null,
      // 浏览量 / 收藏数 / 留言数（随机冗余数据）
      viewCount: faker.number.int({ min: 0, max: 500 }),
      collectCount: faker.number.int({ min: 0, max: 100 }),
      messageCount: faker.number.int({ min: 0, max: 50 }),
      // 是否置顶（5% 概率）
      isTop: faker.datatype.boolean(),
    }
  }
}
