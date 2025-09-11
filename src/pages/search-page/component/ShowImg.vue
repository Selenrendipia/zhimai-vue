<!-- 活动图片 -->
<template>
  <template v-if="item.isImgError">
    <div
      class="mt-4 h-50 flex items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-xl text-blue-400 font-bold"
      @click="reloadImg"
    >
      <wd-icon name="refresh" />
      <div class="ml-3">
        图片加载失败，请点击重试
      </div>
    </div>
  </template>
  <template v-else-if="item.image_url">
    <image
      class="h-50 w-full"
      :src="item.image_url" mode="aspectFill"
      lazy-load
      show-menu-by-longpress
      @error="imageError"
    />
  </template>
  <template v-else>
    <!-- 这里可以修改为：根据活动类型，替换自己设计的二课图片 -->
    <div class="mt-4 h-50 flex items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-xl text-blue-400 font-bold">
      暂无图片
    </div>
  </template>
</template>

<script lang="ts" setup>
const props = defineProps({
  item: {
    type: Object as any
  },
  // 替换的图片类型
  type: {
    type: String,
    default: ''
  }
})

const item = computed(() => props.item)
// 图片加载失败
function imageError() {
  item.value.isImgError = true
}

// 重新加载图片
function reloadImg() {
  item.value.isImgError = false
}
</script>
