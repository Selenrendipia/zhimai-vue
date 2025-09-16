<template>
  <view class="relative min-h-screen bg-white">
    <!-- 右上角菜单按钮 -->
    <view
      class="absolute right-15 top-6 z-10 text-base text-gray-400 font-normal"
      @click="onButtonShow"
    >
      功能﹀
    </view>

    <!-- 活动标题 -->
    <view class="mx-[70rpx] pt-6 text-[37rpx] font-bold">
      {{ detail?.title || '活动标题' }}
    </view>

    <!-- 活动信息卡片 -->
    <view class="acti mx-[70rpx] my-[1vh] rounded-lg">
      <image
        class="pic mb-[1.5vh] h-[350rpx] rounded-[30rpx] object-contain"
        :src="detail?.image_url"
        mode="aspectFit"
      />
      <view class="content mt-[30rpx]">
        <view class="label text-[36rpx] font-semibold">
          活动时间
        </view>
        <view class="item mt-[15rpx] w-[610rpx] break-all">
          {{ formatTime(detail?.start_time) }} - {{ formatTime(detail?.end_time) }}
        </view>
      </view>
      <view class="content mt-[30rpx]">
        <view class="label text-[36rpx] font-semibold">
          校区
        </view>
        <view class="item mt-[15rpx] w-[610rpx] break-all">
          {{ detail?.location || '-' }}
        </view>
      </view>
      <view class="content mt-[30rpx]">
        <view class="label text-[36rpx] font-semibold">
          二课类型
        </view>
        <view class="item mt-[15rpx] w-[610rpx] break-all">
          {{ detail?.activity_type || '-' }}
        </view>
      </view>
      <view class="content mt-[30rpx]">
        <view class="label text-[36rpx] font-semibold">
          学分类型
        </view>
        <view class="item mt-[15rpx] w-[610rpx] break-all">
          {{ detail?.credit_type || '-' }}
        </view>
      </view>
      <view class="content mt-[30rpx]">
        <view class="label text-[36rpx] font-semibold">
          活动级别
        </view>
        <view class="item mt-[15rpx] w-[610rpx] break-all">
          {{ detail?.status || '-' }}
        </view>
      </view>
      <view class="content mt-[30rpx]">
        <view class="label text-[36rpx] font-semibold">
          参与年级
        </view>
        <view class="item mt-[15rpx] w-[610rpx] break-all">
          {{ detail?.target_audience || '-' }}
        </view>
      </view>
      <view class="content mt-[30rpx]">
        <view class="label text-[36rpx] font-semibold">
          活动链接
        </view>
        <view class="item mt-[15rpx] w-[610rpx] break-all">
          {{ detail?.link || '-' }}
        </view>
      </view>
    </view>

    <!-- 底部栏 -->
    <view
      v-if="buttonHidden"
      class="fixed bottom-0 left-0 z-10 h-[80rpx] w-full flex items-center justify-between border-t border-gray-200 bg-white px-6"
      style="box-sizing: border-box;"
    >
      <view class="flex items-center">
        <text class="text-base font-bold">
          知脉校园
        </text>
      </view>
      <view class="flex items-center space-x-6">
        <text class="text-2xl" @click="setRemind">
          ⏰
        </text>
        <text class="text-2xl" @click="addCollection">
          {{ detail?.isFavorited ? '★' : '☆' }}
        </text>
      </view>
    </view>

    <!-- 美化后的弹出操作按钮 -->
    <view
      v-if="!buttonHidden"
      class="fixed bottom-0 left-0 z-20 w-full animate-fade-in rounded-t-2xl bg-white shadow-lg pb-safe"
    >
      <!-- ...弹窗内容保持不变... -->
      <view class="flex flex-row justify-around pb-2 pt-6">
        <view
          class="h-[140rpx] w-[140rpx] flex flex-col items-center justify-center rounded-xl bg-[#f6f7fa] shadow transition active:bg-blue-100"
          @click="addCollection"
        >
          <view class="mb-1 text-[48rpx]">
            {{ detail?.isFavorited ? '★' : '☆' }}
          </view>
          <view class="text-center text-xs text-gray-700 leading-tight">
            {{ detail?.isFavorited ? '移除' : '加入' }}<br>我的收藏
          </view>
        </view>
        <view
          class="h-[140rpx] w-[140rpx] flex flex-col items-center justify-center rounded-xl bg-[#f6f7fa] shadow transition active:bg-blue-100"
          @click="setRemind"
        >
          <view class="mb-1 text-[48rpx]">
            ⏰
          </view>
          <view class="text-center text-xs text-gray-700 leading-tight">
            设为<br>定时提醒
          </view>
        </view>
      </view>
      <view
        class="mx-8 mb-2 mt-2 h-[48rpx] flex items-center justify-center rounded-xl bg-gray-100 text-base text-gray-500 active:bg-gray-200"
        @click="onButtonShow"
      >
        取消
      </view>
    </view>
    <!-- 遮罩层 -->
    <view
      class="fixed left-0 top-0 z-10 h-full w-full bg-black bg-opacity-40"
      :class="[buttonHidden ? 'hidden' : 'block']"
      @click="onButtonShow"
    />
  </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getActivityDetail } from '@/api/activities'

const detail = ref<any>(null)
const buttonHidden = ref(true)

function onButtonShow() {
  buttonHidden.value = !buttonHidden.value
}

function addCollection() {
  uni.showToast({ title: '已加入收藏', icon: 'success' })
  buttonHidden.value = true
}

function setRemind() {
  uni.showToast({ title: '跳转定时提醒', icon: 'none' })
  buttonHidden.value = true
  // uni.navigateTo({ url: `/subPackages/pages/remind-create/remind-create?title=${detail.value?.title}` })
}

function formatTime(time?: string) {
  if (!time)
    return '-'
  return time.split('T')[0].replace(/-/g, '.')
}

// 获取活动id并请求详情
onLoad((query) => {
  const id = query!.id
  if (id) {
    getActivityDetail(Number(id)).then((res) => {
      detail.value = res
    })
  }
})
</script>

<style>
/* 简单弹窗动画，可选 */
.animate-fade-in {
  animation: fadeInUp 0.25s;
}
@keyframes fadeInUp {
  from {
    transform: translateY(100%);
    opacity: 0.5;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
