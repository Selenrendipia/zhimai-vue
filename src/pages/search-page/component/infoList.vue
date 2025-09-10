<template>
  <div v-for="(item, index) in activities" :key="item.activity_id" class="my-5 rounded-2 bg-white px-3 py-3">
    <!-- 顶部 -->
    <div class="relative flex items-center justify-between">
      <!-- 公众号标题 -->
      <div class="flex">
        <image
          class="h-10 w-10 rounded-full" mode="aspectFill"
          src="https://img10.360buyimg.com/jmadvertisement/jfs/t1/70325/36/14954/36690/5dcd3e3bEee5006e0/aed1ccf6d5ffc764.png"
        />
        <div class="ml-5 flex items-center text-base text-gray-800 font-bold">
          {{ item.organizer ?? '暂无标题' }}
        </div>
      </div>
      <!-- 功能按钮 -->
      <div class="absolute right-3 top-1 w-22 text-gray-500">
        <div class="flex cursor-pointer justify-between rounded-md bg-gray-100 px-3 py-2" @click.stop="toggleDropdown(index)">
          功能
          <wd-icon v-if="index === dropdownIndex" name="arrow-up" />
          <wd-icon v-else name="arrow-down" />
        </div>
        <div v-if="dropdownIndex === index" class="z-10 rounded-lg bg-gray-200">
          <div class="cursor-pointer px-3 py-2 hover:bg-primary/10" @click="onOption1">
            定时提醒
          </div>
          <div class="cursor-pointer px-3 py-2 hover:bg-primary/10" @click="onOption2">
            加入收藏
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="mb-2 flex items-center justify-between">
        <div class="relative">
          <div class="cursor-pointer rounded bg-gray-100 px-2 py-1 text-gray-500 transition hover:bg-primary/10" @click.stop="toggleDropdown(index)">
            功能﹀
          </div>
          <div v-if="dropdownIndex === index" class="absolute right-0 z-10 mt-2 w-24 rounded-lg bg-white shadow">
            <div class="cursor-pointer rounded px-3 py-2 hover:bg-primary/10" @click="onOption1">
              定时提醒
            </div>
            <div class="cursor-pointer rounded px-3 py-2 hover:bg-primary/10" @click="onOption2">
              加入收藏
            </div>
          </div>
        </div>
        <div class="mb-2 h-24 flex items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-xl text-blue-400 font-bold">
          {{ item.image_url ?? '活动图片' }}
        </div>
        <div class="mb-1 text-base text-gray-700 font-bold">
          {{ item.title ?? '活动标题' }}
        </div>
        <div class="text-xs text-gray-400">
          {{ item.start_time ?? '活动时间' }}
        </div>
      </div> -->
  </div>
</template>

<script setup lang="ts">
const dropdownIndex = ref(-1)
const activities = ref<Array<any>>([
  {
    activity_id: 1,
    organizer: 'tts1'
  },
  {
    activity_id: 2,
    organizer: 'tts1'
  }
  //   {
  //     activity_id: 3,
  //     organizer: 'tts1'
  //   },
  //   {
  //     activity_id: 4,
  //     organizer: 'tts1'
  //   },
  //   {
  //     activity_id: 5,
  //     organizer: 'tts1'
  //   },
  //   {
  //     activity_id: 6,
  //     organizer: 'tts1'
  //   }
])
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
</script>
