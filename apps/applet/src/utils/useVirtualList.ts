import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

interface UseVirtualListOptions {
  itemHeight: number // 单行高度 (px)，含行间距
  bufferCount?: number // 上下各多渲染的缓冲行数，默认 3
  columns?: number // 每行列数（两列网格传 2），默认 1
}

export function useVirtualList<T>(options: UseVirtualListOptions) {
  const { itemHeight, bufferCount = 3, columns = 1 } = options

  // 完整列表数据
  const allData = ref<T[]>([])

  // 滚动容器实例
  const scrollContainerRef = ref<any>()

  // 当前滚动距离 (px)
  const scrollTop = ref(0)

  // 容器可视区域高度 (px)
  const containerHeight = ref(0)

  // 总行数（不足一行的按一行算）
  const totalRows = computed(() => Math.ceil(allData.value.length / columns))

  // 当前滚动位置对应的行号（要完全超过一行才算下一行）
  const currentRow = computed(() => Math.floor(scrollTop.value / itemHeight))

  // 起始行（含上方缓冲）
  const startRow = computed(() => Math.max(0, currentRow.value - bufferCount))

  // 可视区域内能显示的行数
  const visibleRows = computed(() => Math.ceil(containerHeight.value / itemHeight))

  // 结束行（含下方缓冲）
  const endRow = computed(() =>
    Math.min(totalRows.value - 1, currentRow.value + visibleRows.value + bufferCount)
  )

  // 起始数据索引 = 起始行 * 每行列数
  const startIndex = computed(() => startRow.value * columns)

  // 结束数据索引
  const endIndex = computed(() =>
    Math.min(allData.value.length - 1, (endRow.value + 1) * columns - 1)
  )

  /**
   * 计算当前可视区域的数据列表
   */
  const visibleData = computed(() => {
    if (allData.value.length === 0) return []
    return allData.value.slice(startIndex.value, endIndex.value + 1)
  })

  /**
   * 总高度 (用于撑开 scroll-view 的滚动条)
   */
  const totalHeight = computed(() => {
    return totalRows.value * itemHeight
  })

  /**
   * 偏移量 (用于绝对定位可见数据到正确位置,欺骗滚动条位置)
   */
  const offsetY = computed(() => {
    return startRow.value * itemHeight
  })

  /**
   * 处理滚动事件
   * @param e Uni-app scroll-view 的 scroll 事件对象
   */
  const handleScroll = (e: any) => {
    // Uni-app scroll-view 返回 detail.scrollTop
    scrollTop.value = e.detail.scrollTop
  }

  /**
   * 更新容器可视高度
   */
  const updateContainerHeight = () => {
    if (!scrollContainerRef.value) return

    nextTick(() => {
      // 创建节点选择器
      const query = uni.createSelectorQuery()
      // 选择容器节点 class，与模板一致
      query
        .select('.virtual-scroll-container')
        .boundingClientRect((rect: any) => {
          if (rect) {
            containerHeight.value = rect.height
          }
        })
        .exec() // 执行
    })
  }

  /**
   * 追加数据 (用于无限加载)
   */
  const appendData = (newItems: T[]) => {
    allData.value = [...allData.value, ...newItems] as T[]
  }

  /**
   * 重置数据
   */
  const reset = () => {
    allData.value = []
    scrollTop.value = 0
  }

  /**
   * 窗口大小变化处理（需提取为具名函数，以便正确移除监听）
   */
  const handleWindowResize = () => {
    updateContainerHeight()
  }

  onMounted(() => {
    updateContainerHeight()
    // 监听窗口大小变化（如旋转屏幕）
    uni.onWindowResize(handleWindowResize)
  })

  onUnmounted(() => {
    // 必须传入之前注册的回调函数才能正确移除监听
    uni.offWindowResize(handleWindowResize)
  })

  return {
    scrollContainerRef,
    visibleData,
    totalHeight,
    offsetY,
    handleScroll,
    appendData,
    reset,
    allData,
  }
}
