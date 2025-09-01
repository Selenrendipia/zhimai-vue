<route lang="json5" type="page">
  {
    name: 'demo',
    style: {
      navigationStyle: 'default',
      navigationBarTitleText: '分包页面 标题',
    },
  }
</route>

<template>
  <view class="text-center">
    <view class="text-green-500">
      分包页面demo
    </view>
  </view>
</template>

<script lang="ts" setup>
const route = useRoute()
const globalStore = useGlobalStore()
console.log(globalStore.globalData)
onLoad((options) => {
  console.log(options)
})
</script>

<style lang="scss" scoped>
//
</style>
