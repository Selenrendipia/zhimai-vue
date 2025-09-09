<route lang="json5" type="page">
  {
    "name": "category",
    "style": {
      "navigationStyle": "custom",
      "navigationBarTitleText": "分类"
    }
  }
</route>

<template>
  <!-- 动态适配自定义顶部导航栏 -->
  <view :style="`height:${navBarHeight}px;background:#fff;`" class="nav-bar flex items-center border-b border-gray-200 px-4">
    <view :style="`height:${capsuleHeight}px;width:${capsuleHeight}px;`" class="flex items-center justify-center" @click="onCustomBack">
      返回
    </view>
    <view class="flex flex-1 items-center justify-center" :style="`height:${capsuleHeight}px;`">
      <text class="text-lg text-black font-bold">
        分类
      </text>
    </view>
    <view :style="`height:${capsuleHeight}px;width:${capsuleHeight}px;`" class="flex items-center justify-center">
      <!-- 右侧胶囊按钮占位，可用 image/svg/slot -->
      <image src="/static/capsule.png" style="width:100%;height:100%;" mode="aspectFit" />
    </view>
  </view>
  <view class="w-full flex flex-col overflow-hidden bg-gray-100 pb-safe" style="height: 100vh;">
    <!-- 顶部分类 -->
    <view class="h-[7vh] min-h-12 flex items-center bg-white px-6">
      <view class="mr-4 py-1 text-lg text-primary font-bold">
        分类
      </view>
      <view
        v-for="(item, idx) in topClassifyList"
        :key="idx"
        class="mr-2 cursor-pointer border border-[#eaf3ff] rounded-lg bg-gray-100 px-3 py-1 text-sm text-primary transition-all"
        :class="topClassifyIndex === idx ? 'bg-primary text-white border-primary font-bold' : ''"
        @click="onTopClassifyTap(idx)"
      >
        {{ item }}
      </view>
    </view>
    <view class="flex flex-row" style="height: calc(100vh - 15vh);">
      <!-- 左侧菜单栏 -->
      <view class="h-full w-1/4 overflow-y-auto bg-gray-200">
        <view class="flex flex-col">
          <view
            v-for="(item, idx) in menu"
            :key="idx"
            class="h-24 cursor-pointer select-none overflow-hidden text-ellipsis whitespace-nowrap text-center text-sm text-gray-500 leading-24"
            :class="leftIndex === idx ? 'bg-white text-black font-bold' : ''"
            @click="onClickLeft(idx)"
          >
            {{ item.title }}
          </view>
        </view>
      </view>
      <!-- 右侧菜单栏 -->
      <view class="relative w-3/4">
        <scroll-view scroll-y class="h-full pb-[6vh]" :scroll-into-view="scrollToId">
          <view
            v-for="(menu_item, outIndex) in menu"
            :id="`right-${outIndex}`"
            :key="outIndex"
            class="px-5 pb-2 pt-12"
          >
            <view class="mb-2 text-sm text-gray-800 font-bold">
              {{ menu_item.title }}
            </view>
            <view class="flex flex-wrap gap-2">
              <view
                v-for="(option, inIndex) in menu_item.list"
                :key="inIndex"
                class="min-h-10 flex cursor-pointer select-none items-center justify-center rounded-lg px-3 py-1 text-xs"
                :class="menu_item.choose[inIndex] ? 'bg-blue-200 text-blue-700 font-bold' : 'bg-gray-200 text-gray-600'"
                @click="onClickOption(outIndex, inIndex)"
              >
                {{ option }}
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <!-- 底部按钮 -->
    <view class="h-[6vh] min-h-10 w-full flex">
      <button class="w-1/2 cursor-pointer bg-gray-300 text-center text-sm leading-[6vh]" @click="resetOptions">
        重置
      </button>
      <button class="w-1/2 cursor-pointer bg-yellow-200 text-center text-sm leading-[6vh]" @click="onSearch">
        确认
      </button>
    </view>
    <!-- 弹窗区域 -->
    <view v-if="showSaveModal" class="fixed left-0 top-0 z-50 h-full w-full flex items-center justify-center bg-black bg-opacity-30">
      <view class="w-72 flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
        <view class="mb-4 text-base text-gray-800 font-bold">
          是否保存修改后的筛选项？
        </view>
        <view class="w-full flex gap-2">
          <button class="flex-1 rounded bg-primary py-2 text-white" @click="onSaveMenu">
            保存
          </button>
          <button class="flex-1 rounded bg-gray-300 py-2 text-gray-700" @click="onNotSaveMenu">
            不保存
          </button>
          <button class="flex-1 rounded bg-gray-200 py-2 text-gray-500" @click="onCancelModal">
            取消
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useCategoryStore } from '@/pinia/store/category'

const navBarHeight = ref(44) // 默认导航栏高度
const capsuleHeight = ref(32) // 默认胶囊高度
// #ifdef MP-WEIXIN
onMounted(() => {
  const system = wx.getSystemInfoSync()
  const menu = wx.getMenuButtonBoundingClientRect()
  navBarHeight.value = system.statusBarHeight + menu.height + (menu.top - system.statusBarHeight) * 2
  capsuleHeight.value = menu.height
})
// #endif

console.log('category 页面初始化')
const categoryStore = useCategoryStore()
const topClassifyList = ['全部', '信息资讯', '二课练测']
const topClassifyIndex = ref(categoryStore.topClassifyIndex)
console.log('初始 topClassifyIndex:', topClassifyIndex.value)

const defaultMenu = [
  { title: '校区', list: ['全部', '广州校区', '清远校区', '肇庆校区'], choose: [true, false, false, false], choosenum: 0 },
  { title: '年级', list: ['全部', '大一', '大二', '大三', '大四', '专升本'], choose: [true, false, false, false, false, false], choosenum: 0 },
  { title: '学分类型', list: ['全部', '思想成长', '文体活动', '实践实习', '创新创业', '志愿公益', '技能特长', '菁英成长'], choose: [true, false, false, false, false, false, false, false], choosenum: 0 },
  { title: '证书', list: ['全部', '四六级', '雅思托福', '计算机等级证书', '教资', '普通话', '会计', '证券从业资格证'], choose: [true, false, false, false, false, false, false, false], choosenum: 0 },
  { title: '院系', list: ['全部', '金投院', '会计学院', '保险学院', '财新院', '国家金融学学院', '金统院', '国教院', '大数据院', '工管院', '法学院', '外文院', '创业教育学院', '经贸院'], choose: [true, false, false, false, false, false, false, false, false, false, false, false, false, false], choosenum: 0 }
]
const menu = ref(categoryStore.menu?.length ? categoryStore.menu : JSON.parse(JSON.stringify(defaultMenu)))
console.log('初始 menu:', menu.value)
const leftIndex = ref(0)
const scrollToId = ref('')
const lastMenu = ref(JSON.parse(JSON.stringify(menu.value)))
console.log('初始 lastMenu:', lastMenu.value)
const showSaveModal = ref(false)
const leaveNext = ref<null | ((...args: any[]) => void)>(null)

function onTopClassifyTap(idx: number) {
  console.log('onTopClassifyTap', idx)
  topClassifyIndex.value = idx
  categoryStore.setTopClassifyIndex(idx)
}

function onClickLeft(idx: number) {
  console.log('onClickLeft', idx)
  leftIndex.value = idx
  scrollToId.value = `right-${idx}`
  setTimeout(() => {
    scrollToId.value = ''
  }, 300)
}

function onClickOption(outIndex: number, inIndex: number) {
  console.log('onClickOption', outIndex, inIndex)
  const item = menu.value[outIndex]
  const len = item.choose.length
  const selectedCount = item.choose.filter(Boolean).length
  // 只剩一个选中项时不允许取消
  if (selectedCount === 1 && item.choose[inIndex])
    return
  if (inIndex === 0) {
    // 全部选中
    item.choose = Array.from({ length: len }, () => true)
    item.choosenum = len - 1
  } else {
    item.choose[inIndex] = !item.choose[inIndex]
    const selectedCountNonAll = item.choose.slice(1).filter(Boolean).length
    item.choosenum = selectedCountNonAll
    if (selectedCountNonAll === len - 1) {
      item.choose[0] = true
    } else if (selectedCountNonAll === 0) {
      item.choose = item.choose.map((_v: boolean, i: number) => i === 0)
    } else {
      item.choose[0] = false
    }
  }
  console.log('menu after option:', menu.value)
}

function resetOptions() {
  console.log('resetOptions')
  menu.value = JSON.parse(JSON.stringify(defaultMenu))
  lastMenu.value = JSON.parse(JSON.stringify(menu.value))
  showSaveModal.value = false
  leftIndex.value = 0
  categoryStore.setMenu(JSON.parse(JSON.stringify(menu.value)))
  console.log('menu after reset:', menu.value)
}

function onSearch() {
  console.log('onSearch，选中项为：', menu.value)
  categoryStore.setMenu(JSON.parse(JSON.stringify(menu.value)))
  lastMenu.value = JSON.parse(JSON.stringify(menu.value))
  uni.showToast({ title: '已确认', icon: 'success' })
}

// 移除 onBeforeRouteLeave 钩子，全部依赖微信小程序 onBackPress 拦截弹窗

function onSaveMenu() {
  console.log('onSaveMenu')
  lastMenu.value = JSON.parse(JSON.stringify(menu.value))
  showSaveModal.value = false
  uni.showToast({ title: '已保存', icon: 'success' })
  if (leaveNext.value) {
    categoryStore.setMenu(JSON.parse(JSON.stringify(menu.value)))
    leaveNext.value()
    leaveNext.value = null
    console.log('保存并离开')
  }
}
function onNotSaveMenu() {
  console.log('onNotSaveMenu')
  menu.value = JSON.parse(JSON.stringify(lastMenu.value))
  showSaveModal.value = false
  uni.showToast({ title: '已恢复', icon: 'none' })
  if (leaveNext.value) {
    categoryStore.setMenu(JSON.parse(JSON.stringify(lastMenu.value)))
    leaveNext.value()
    leaveNext.value = null
    console.log('不保存并离开')
  }
}
function onCancelModal() {
  console.log('onCancelModal')
  showSaveModal.value = false
  leaveNext.value = null
}

// 自定义返回按钮逻辑
function onCustomBack() {
  if (JSON.stringify(menu.value) !== JSON.stringify(lastMenu.value)) {
    uni.showModal({
      title: '提示',
      content: '是否保存更改后筛选结果？',
      showCancel: true,
      confirmText: '保存',
      cancelText: '不保存',
      success: (res) => {
        if (res.confirm) {
          categoryStore.setMenu(JSON.parse(JSON.stringify(menu.value)))
          lastMenu.value = JSON.parse(JSON.stringify(menu.value))
          uni.showToast({ title: '已保存', icon: 'success' })
          uni.navigateBack()
        } else {
          menu.value = JSON.parse(JSON.stringify(lastMenu.value))
          uni.navigateBack()
        }
      }
    })
  } else {
    uni.navigateBack()
  }
}

// 页面每次进入时都从store同步选中项
function syncMenuFromStore() {
  console.log('syncMenuFromStore')
  menu.value = categoryStore.menu?.length ? JSON.parse(JSON.stringify(categoryStore.menu)) : JSON.parse(JSON.stringify(defaultMenu))
  lastMenu.value = JSON.parse(JSON.stringify(menu.value))
  console.log('menu after sync:', menu.value)
}

// 微信小程序 onShow 钩子
if (typeof wx !== 'undefined' && typeof onShow === 'function') {
  // 微信小程序 onShow 钩子
  onShow(() => {
    console.log('wx onShow')
    syncMenuFromStore()
  })
}

// 页面显示时自动恢复未确认的筛选项（微信小程序）
if (typeof wx !== 'undefined' && typeof onShow === 'function') {
  // onShow 钩子
  onShow(() => {
    console.log('wx onShow 恢复未确认项')
    if (JSON.stringify(menu.value) !== JSON.stringify(lastMenu.value)) {
      menu.value = JSON.parse(JSON.stringify(lastMenu.value))
      console.log('menu 恢复为 lastMenu:', menu.value)
    }
  })
}

onBeforeUnmount(() => {
  console.log('category 页面卸载')
  // 清除微信小程序返回拦截（无需 onBackPress(null)，避免 TypeError）
})

onUnload(() => {
  // 延迟执行确保弹窗显示
})
</script>
