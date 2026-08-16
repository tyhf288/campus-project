<template>
  <view class="market-container">
    <!-- 搜索框（仅展示，搜索逻辑暂未实现） -->
    <view class="search-section">
      <uni-easyinput
        prefixIcon="search"
        v-model="searchKeyword"
        placeholder="搜索教材、数码、宿舍用品"
        @change="loadGoods()"
      ></uni-easyinput>
    </view>

    <!-- 分类标签 -->
    <view class="category-section">
      <scroll-view scroll-x class="category-scroll">
        <view class="category-tags">
          <view
            v-for="item in categoryList"
            :key="item.id"
            class="tag-item"
            :class="{ active: activeCategoryId === item.id }"
            @click="handleCategoryClick(item)"
          >
            <text>{{ item.name }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 虚拟滚动列表 -->
    <scroll-view
      scroll-y
      class="virtual-scroll-container"
      ref="scrollContainerRef"
      @scroll="handleScroll"
      enable-back-to-top
      lower-threshold="100"
      @scrolltolower="loadMore"
    >
      <!--占位层，撑开滚动区域-->
      <view class="virtual-placeholder" :style="{ height: `${totalHeight}px` }">
        <!--内容层，通过transform移动到可视位置-->
        <view class="virtual-content" :style="{ transform: `translateY(${offsetY}px)` }">
          <!--数据渲染-->
          <good-item :good-list="visibleData" />
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-tip">加载中...</view>
      <view v-if="!hasMore && allData.length > 0" class="no-more-tip">没有更多了</view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import GoodItem from '@/components/goodItem/index.vue'
import type { CategoryVO, GoodVO } from '@campus/types'
import { GoodsStatus } from '@campus/types'
import { getCategoryList, getGoodsList } from '@/api/goods'
import { useVirtualList } from '@/utils/useVirtualList'

// 分类列表（后端返回）
const categoryList = ref<CategoryVO[]>([])

// 搜索关键词
const searchKeyword = ref('')

// 当前选中的分类 ID（0 = 「全部」虚拟分类）
const activeCategoryId = ref<number>(0)

// 分页相关
const page = ref(1)
const pageSize = 10
const total = ref(0)
const loading = ref(false)
const hasMore = ref(true)

/**
 * 加载分类列表
 */
const loadCategories = async () => {
  try {
    const res = await getCategoryList()
    const list = res.data as CategoryVO[]
    // 前端插入虚拟「全部」分类（id=0），点击时清空分类筛选
    categoryList.value = [
      { id: 0, name: '全部', sort: 0, enable: true, createAt: '', updateAt: null },
      ...list,
    ]
  } catch {
    // 错误已在拦截器处理
  }
}

/**
 * 虚拟滚动列表相关
 */
// --- 系统信息与高度计算 ---
const sysInfo = uni.getSystemInfoSync()
const PX_PER_RPX = sysInfo.screenWidth / 750
// 行高 = 卡片高度 492rpx + 网格行间距 16rpx（两列网格，虚拟滚动按「行」计算）
const ROW_HEIGHT_RPX = 508
const ROW_HEIGHT_PX = ROW_HEIGHT_RPX * PX_PER_RPX

const {
  scrollContainerRef,
  visibleData,
  totalHeight,
  offsetY,
  handleScroll,
  appendData,
  reset,
  allData,
} = useVirtualList<GoodVO>({
  itemHeight: ROW_HEIGHT_PX,
  bufferCount: 3,
  columns: 2,
})

/**
 * 追加数据（按 id 去重，防止后端分页因 createAt 相同顺序不稳、返回重复数据导致 wx:key 冲突）
 */
const appendUnique = (list: GoodVO[]) => {
  const seen = new Set(allData.value.map((g) => g.id))
  appendData(list.filter((g) => !seen.has(g.id)))
}

/**
 * 加载商品列表（第一页 / 切换分类 / 搜索）
 */
const loadGoods = async () => {
  page.value = 1
  hasMore.value = true
  loading.value = true
  try {
    const res = await getGoodsList({
      page: page.value,
      pageSize,
      status: GoodsStatus.APPROVED,
      categoryId: activeCategoryId.value,
      title: searchKeyword.value,
    })
    const data = res.data
    // 切换条件时清空旧数据，避免与上一份列表叠加
    reset()
    appendUnique(data.list || [])
    total.value = data.total || 0
    hasMore.value = allData.value.length < total.value
  } catch {
    // 错误已在拦截器处理
  } finally {
    loading.value = false
  }
}

/**
 * 加载更多商品（触底）
 */
const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  try {
    const nextPage = page.value + 1
    const res = await getGoodsList({
      page: nextPage,
      pageSize,
      status: GoodsStatus.APPROVED,
      categoryId: activeCategoryId.value,
      title: searchKeyword.value,
    })
    const data = res.data
    appendUnique(data.list || [])
    total.value = data.total || 0
    page.value = nextPage
    hasMore.value = allData.value.length < total.value
  } catch {
    // 错误已在拦截器处理
  } finally {
    loading.value = false
  }
}

/**
 * 点击分类标签
 */
const handleCategoryClick = (item: CategoryVO) => {
  activeCategoryId.value = item.id
  // 切换分类后重新请求第一页
  loadGoods()
}

// 页面加载
onLoad(() => {
  loadCategories()
  loadGoods()
})
</script>

<style scoped lang="scss">
.market-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: $bg-page;
}

// 搜索框区域
.search-section {
  padding: $gap-base $page-padding;
  background-color: $bg-card;
}

// 分类标签区域
.category-section {
  padding: $gap-base $page-padding;
  background-color: $bg-card;
  margin-bottom: $gap-sm;

  .category-scroll {
    white-space: nowrap;
    // 隐藏滚动条
    ::v-deep ::-webkit-scrollbar {
      display: none;
    }
  }

  .category-tags {
    display: inline-flex;
    align-items: center;
    gap: $gap-sm;
  }

  .tag-item {
    padding: 14rpx 32rpx;
    border-radius: $radius-full;
    font-size: $font-size-sm;
    font-weight: $font-medium;
    transition: all 0.25s ease;
    // 未选中：浅橙底 + 橙褐字
    background-color: #fff4ea;
    color: #c9833f;

    // 按压缩放反馈
    &:active {
      transform: scale(0.94);
    }

    // 选中：橙色渐变胶囊 + 白字 + 投影
    &.active {
      font-weight: $font-bold;
      background: linear-gradient(135deg, #ffb783 0%, #ff9f5b 100%);
      color: #ffffff;
      box-shadow: 0 6rpx 16rpx rgba(255, 159, 91, 0.35);
    }
  }
}

/* 虚拟滚动容器：必须占据剩余空间并有明确高度 */
.virtual-scroll-container {
  flex: 1;
  min-height: 0; // 关键：允许 flex 子项收缩，内部才能滚动并触发触底事件
  position: relative;
  /* 隐藏滚动条可选 */
  ::-webkit-scrollbar {
    display: none;
  }
}

.virtual-placeholder {
  position: relative;
  width: 100%;
}

.virtual-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  will-change: transform; /* GPU 加速，提升滚动流畅度 */
  padding: 0 20rpx;
  box-sizing: border-box;
}

// 加载状态提示
.loading-tip,
.no-more-tip {
  text-align: center;
  padding: 20rpx;
  color: #999;
  font-size: 28rpx;
  background-color: #fff;
}
</style>
