<route lang="json5" type="home">
  {
    name: 'info',
    style: {
      navigationStyle: 'default',
      navigationBarTitleText: '首页',
    },
  }
</route>

<template>
  <!-- <view class="px-10 py-20 text-center">
    <wd-button @click="handleClick">
      跳转分包
    </wd-button>
  </view> -->
  <scroll-view style="height: 100vh;" class="bg-gray-50 pb-safe" scroll-y @scroll="onScroll">
    <!-- 顶部 -->
    <view class="mb-2 flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow">
      <!-- 分类筛选自定义下拉 -->
      <view class="relative">
        <view class="classify-btn" @click="toggleClassifyDropdown">
          <text class="text-base text-primary font-bold">
            分类筛选
          </text>
          <text class="text-xs text-gray-400">
            ﹀
          </text>
        </view>
        <view v-if="showClassifyDropdown" class="absolute left-0 z-10 mt-2 w-32 rounded-lg bg-white shadow">
          <view
            class="cursor-pointer rounded px-4 py-2 text-base text-gray-600 transition hover:bg-blue-50"
            :class="classifyType === 'all' ? 'bg-blue-50 text-primary' : ''" @click="onClassifySelect('all')"
          >
            全部
          </view>
          <view
            class="cursor-pointer rounded px-4 py-2 text-base text-gray-600 transition hover:bg-blue-50"
            :class="classifyType === 'info' ? 'bg-blue-50 text-primary' : ''" @click="onClassifySelect('info')"
          >
            信息资讯
          </view>
          <view
            class="cursor-pointer rounded px-4 py-2 text-base text-gray-600 transition hover:bg-blue-50"
            :class="classifyType === 'activity' ? 'bg-blue-50 text-primary' : ''" @click="onClassifySelect('activity')"
          >
            二课综测
          </view>
          <view
            class="flex cursor-pointer items-center gap-1 rounded px-4 py-2 text-left text-base text-gray-600 transition hover:underline"
            @click="onClassifyMore"
          >
            更多
          </view>
        </view>
      </view>
      <!-- 跳转"搜索页面" -->
      <!-- <navigator class="search" url="/pages/search/search">
      <image src="/assets/public/search.png" />
    </navigator> -->
      <text class="text-xl text-gray-500">
        <i class="i-carbon-search" />搜索
      </text>
    </view>
    <!-- 置顶通知 -->
    <view class="mb-2">
      <view class="mb-2 rounded-lg bg-gray-200 py-4 text-center text-lg text-gray-700 font-bold">
        重要常驻通知
      </view>
      <swiper class="rounded-lg" indicator-dots>
        <swiper-item v-for="outIndex in Math.ceil(swiper.length / 3)" :key="outIndex">
          <view class="grid grid-cols-3 gap-2">
            <view v-for="inIndex in 3" :key="inIndex" class="rounded-lg bg-gray-100 py-4 text-center text-base text-gray-600 shadow">
              {{ swiper[(outIndex - 1) * 3 + (inIndex - 1)] }}
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <view class="info-list">
      <view class="space-y-4">
        <view v-for="(item, index) in activities" :key="item.activity_id" class="rounded-lg bg-white p-4 shadow">
          <view class="mb-2 flex items-center justify-between">
            <view class="flex items-center gap-2">
              <view class="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 text-lg text-gray-400">
                {{ '人' }}
              </view>
              <text class="text-base text-gray-800 font-bold">
                {{ item.organizer ?? '公众号标题' }}
              </text>
            </view>
            <view class="relative">
              <view class="cursor-pointer rounded bg-gray-100 px-2 py-1 text-gray-500 transition hover:bg-primary/10" @click.stop="toggleDropdown(index)">
                功能﹀
              </view>
              <view v-if="dropdownIndex === index" class="absolute right-0 z-10 mt-2 w-24 rounded-lg bg-white shadow">
                <view class="cursor-pointer rounded px-3 py-2 hover:bg-primary/10" @click="onOption1">
                  定时提醒
                </view>
                <view class="cursor-pointer rounded px-3 py-2 hover:bg-primary/10" @click="onOption2">
                  加入收藏
                </view>
              </view>
            </view>
          </view>
          <view class="mb-2 h-24 flex items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-xl text-blue-400 font-bold">
            {{ item.image_url ?? '活动图片' }}
          </view>
          <view class="mb-1 text-base text-gray-700 font-bold">
            {{ item.title ?? '活动标题' }}
          </view>
          <view class="text-xs text-gray-400">
            {{ item.start_time ?? '活动时间' }}
          </view>
        </view>
      </view>
      <!-- 到达底部 -->
      <view v-if="activitiesLoading" hover-class="none">
        加载中...
      </view>
      <view v-else class="py-6 text-center text-gray-400">
        触碰到我的底线了~
      </view>
    </view>
    <!-- 回到顶部按钮 -->
    <!-- <view id="to-top" class="fixed bottom-16 right-4 z-50" bindtap="backTop" wx:if="{{isTop}}">
      <view class="h-10 w-10 flex cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:bg-primary/80">
        ↑
      </view>
    </view> -->
  </scroll-view>
</template>

<script setup lang="ts">
// 快到底部提前加载
import type { ActivityItem } from '@/api/activities'
import { onPageScroll } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { getActivities } from '@/api/activities'

// 测试
const router = useRouter()

const globalStore = useGlobalStore()

console.log(globalStore.globalData)

function handleClick() {
  globalStore.setGlobalData('demo', '1.0.1')
  router.push({
    path: '/pages-sub/demo/index',
    query: {
      name: '张三'
    }
  })
}

// 数据
const back_top = ref(0)
const isTop = ref(false)
const infoList = ref([1, 2, 3, 4, 5, 6])
const showClassifyDropdown = ref(false)
const classifyType = ref('all')
const classifyTypes = [
  { label: '全部', value: 'all' },
  { label: '信息资讯', value: 'info' },
  { label: '二课综测', value: 'activity' }
]
const swiper = ref(['校园跑通知', '四六级考试', '装修通知', '放假通知', '停水通知', '停电通知'])
const activities = ref<ActivityItem[]>([])
const activitiesPage = ref(1)
const activitiesPageSize = ref(10)
const totalActivities = ref(0)
const activitiesLoading = ref(false)
const dropdownIndex = ref(-1)

// 分类筛选下拉显示/隐藏
function toggleClassifyDropdown() {
  showClassifyDropdown.value = !showClassifyDropdown.value
}

// 分类选项点击，前三项重新查询
function onClassifySelect(type: string) {
  classifyType.value = type
  showClassifyDropdown.value = false
  uni.showToast({
    title: `已筛选: ${type}`,
    icon: 'success',
    duration: 800
  })
  // 这里可根据 type 重新请求 activities 数据
}

// 点击“更多”跳转
function onClassifyMore() {
  showClassifyDropdown.value = false
  uni.navigateTo({
    url: '/pages-sub/category/index'
  })
}

// 下拉菜单展开/收起
function toggleDropdown(index: number) {
  dropdownIndex.value = dropdownIndex.value === index ? -1 : index
}

function onOption1() {
  // 处理选项一
}
function onOption2() {
  // 处理选项二
}

// 回到顶部
function backTop() {
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 100
  })
}

// 页面滚动事件，显示回到顶部按钮
onPageScroll((e) => {
  const scrollTop = e.scrollTop
  if (scrollTop >= back_top.value && !isTop.value) {
    isTop.value = true
  } else if (scrollTop <= back_top.value && isTop.value) {
    isTop.value = false
  }
})

function onScroll(e: any) {
  // 兼容微信小程序 scrollHeight/clientHeight 获取不到的问题
  // 只用 scrollTop 判断，快到底部时触发
  const threshold = 200
  const scrollTop = e.detail.scrollTop
  // 理论最大高度（页面内容高度），可用 activities.length * 单卡片高度 + 其它区域高度
  // 这里假设每个活动卡片高度约 160px，顶部+通知区约 200px
  const estimateHeight = activities.value.length * 160 + 200
  // 如果 scrollTop + 可视区高度（100vh=windowHeight）接近内容总高度，则加载
  const windowHeight = uni.getSystemInfoSync().windowHeight
  if (scrollTop + windowHeight + threshold >= estimateHeight) {
    loadMoreActivities()
  }
  // 调试输出
  // console.log('scrollTop:', scrollTop, 'windowHeight:', windowHeight, 'estimateHeight:', estimateHeight)
}

// 生命周期
async function fetchActivities(page = 1) {
  if (activitiesLoading.value)
    return
  activitiesLoading.value = true
  try {
    const res = await getActivities({ page })
    if (page === 1) {
      activities.value = res.data
    } else {
      activities.value = activities.value.concat(res.data)
    }
    totalActivities.value = res.total
    activitiesPage.value = page
  } catch (err) {
    uni.showToast({ title: '活动获取失败', icon: 'none' })
  } finally {
    activitiesLoading.value = false
  }
}

onMounted(() => {
  fetchActivities(1)
})

function loadMoreActivities() {
  console.log('load more activities')
  if (activitiesLoading.value)
    return
  if (activitiesPage.value * activitiesPageSize.value < totalActivities.value) {
    fetchActivities(activitiesPage.value + 1)
  }
}
</script>
