<route lang="json5" type="home">
  {
    name: 'home',
    style: {
      navigationStyle: 'default',
      navigationBarTitleText: '首页',
    },
  }
</route>

<template>
  <view class="px-10 py-20 text-center">
    <wd-button @click="handleClick">
      跳转分包
    </wd-button>
  </view>
</template>

<script setup lang="ts">
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
</script>
