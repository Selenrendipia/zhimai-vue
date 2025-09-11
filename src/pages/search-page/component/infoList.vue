<!-- 活动/信息列表 -->
<!-- 使用wd-loadmore编译会出现app.wxss报错问题，直接删除报错部分即可正常运行 -->
<template>
  <scroll-view>
    <div v-for="(item, index) in activities" :key="item.activity_id" class="mb-5 rounded-3 bg-white px-3 py-4">
      <!-- 顶部 -->
      <div class="relative mb-3 flex items-center justify-between">
        <!-- 公众号标题 -->
        <div class="flex">
          <ShowHeadImg :item="item" />
          <div class="ml-5 flex items-center text-base text-gray-800 font-bold">
            {{ item.organizer ?? '暂无标题' }}
          </div>
        </div>
        <!-- 功能按钮 -->
        <div class="absolute right-3 top-1 w-22 text-gray-500">
          <div class="flex cursor-pointer justify-evenly rounded-md bg-gray-100 px-3 py-2" @click.stop="toggleDropdown(index)">
            功能
            <wd-icon v-if="index === dropdownIndex" name="arrow-up" />
            <wd-icon v-else name="arrow-down" />
          </div>
          <div v-if="dropdownIndex === index" class="z-10 rounded-lg bg-gray-200">
            <div class="cursor-pointer px-3 py-2" @click="onOption1">
              定时提醒
            </div>
            <div class="cursor-pointer px-3 py-2" @click="onOption2">
              加入收藏
            </div>
          </div>
        </div>
      </div>
      <!-- 图片 -->
      <ShowImg :item="item" />
      <div class="text-base text-gray-700 font-bold">
        {{ item.title ?? '活动标题' }}
      </div>
      <div class="text-base text-gray-400">
        {{ item.start_time ?? '活动时间' }}
      </div>
    </div>
  </scroll-view>
  <wd-loadmore :state="state" finished-text="触碰到我的底线啦~" @reload="loadmore" />
</template>

<script setup lang="ts">
import type { LoadMoreState } from 'wot-design-uni/components/wd-loadmore/types'
import { onReachBottom } from '@dcloudio/uni-app'
import ShowHeadImg from './ShowHeadImg.vue'
import ShowImg from './ShowImg.vue'

const dropdownIndex = ref(-1)
const activities = ref<Array<any>>([
  {
    activity_id: 1,
    organizer: 'tts1',
    image_url: 'https://img10.360buyimg.com/jmadvertisement/jfs/t1/70325/36/14954/36690/5dcd3e3bEee5006e0/aed1ccf6d5ffc764.png'
  },
  {
    activity_id: 2,
    organizer: 'tts1'
  },
  {
    activity_id: 3,
    organizer: 'tts1'
  },
  {
    activity_id: 4,
    organizer: 'tts1'
  }
])
// 下拉菜单展开/收起
function toggleDropdown(index: number) {
  dropdownIndex.value = dropdownIndex.value === index ? -1 : index
}
// 定时提醒
function onOption1() {

}
// 加入收藏
function onOption2() {

}

// 列表加载状态
const state = ref<LoadMoreState | undefined>('loading')
// 列表最大数量（接口联调，可能会没有最大数量，通过请求返回的列表数量判断）
const max = ref<number>(16)

onReachBottom(() => {
  if (activities.value.length < max.value) {
    loadmore()
  } else if (activities.value.length === max.value) {
    state.value = 'finished'
  }
})

function loadmore() {
  state.value = 'loading'
  // 接口联调，模拟请求数据
  setTimeout(() => {
    activities.value = activities.value.concat([{
      activity_id: 5,
      organizer: 'tts1',
      image_url: 'https://img10.360buyimg.com/jmadvertisement/jfs/t1/70325/36/14954/36690/5dcd3e3bEee5006e0/aed1ccf6d5ffc764.png'
    }, {
      activity_id: 6,
      organizer: 'tts1'
    }, {
      activity_id: 7,
      organizer: 'tts1'
    }, {
      activity_id: 8,
      organizer: 'tts1'
    }])
  }, 200)
}
</script>
