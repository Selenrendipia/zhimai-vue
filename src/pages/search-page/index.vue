<template>
  <div class="container px-40rpx pt-30rpx">
    <div class="search-box flex items-center pb-40rpx">
      <wd-input v-model="searchContent" no-border clearable :maxlength="20" size="large" prefix-icon="search" />
      <text class="ml-40rpx w-80rpx">
        搜索
      </text>
    </div>
    <div class="history">
      <div class="my-10rpx text-40rpx font-bold">
        历史记录
      </div>
      <div class="history-list">
        <div v-for="(item, index) in historyList" :key="index" class="py-20rpx">
          <text>{{ item }}</text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const globalStore = useGlobalStore()
const searchContent = ref()
const historyList = ref<Array<string>>([
  'aaaaa11',
  'bbbb222',
  'cccc3333'
])
onMounted(() => {

})
</script>

<style lang="scss" scoped>
.container {
  width: calc(100% - 80rpx);
  .search-box {
    :deep(.wd-input) {
      width: calc(100% - 120rpx);
      background-color: #efefef;
      border-radius: 30rpx;
    }
  }
}
</style>
