<template>
  <div class="pt-30rpx">
    <wd-search
      v-model="searchContent"
      cancel-txt="搜索"
      placeholder-left light
      :maxlength="30"
      @search="handleSearch"
      @cancel="handleSearch"
    />
    <div class="px-40rpx py-30rpx">
      <div class="item-center flex justify-between py-10rpx">
        <text class="text-40rpx font-bold">
          历史记录
        </text>
        <wd-icon name="delete-thin" size="40rpx" @click="clearHistory" />
      </div>

      <div>
        <div
          v-for="(item, index) in historyList"
          :key="index"
          class="my-30rpx flex items-center justify-between rounded-20rpx bg-white px-20rpx"
        >
          <text
            class="w-550rpx overflow-hidden text-ellipsis py-20rpx"
            @click="setSearch(item, index)"
          >
            {{ item }}
          </text>
          <wd-icon name="close" @click="remove(index)" />
        </div>
      </div>
    </div>
  </div>
  <wd-message-box />
</template>

<script setup lang="ts">
import { useMessage } from 'wot-design-uni'
import { debounce } from 'wot-design-uni/components/common/util'
import { historyConfig as config } from '@/config'

const message = useMessage()

const router = useRouter()
const globalStore = useGlobalStore()
const searchContent = ref()
const historyList = ref<Array<string>>([
  'aaaaa11',
  'bbbb222',
  'cccc3333333333333333333333333333333333333333333333333333333333333'
])

// 点击/回车 搜索
const handleSearch = debounce(() => {
  searchContent.value = searchContent.value.trim()
  if (!searchContent.value)
    return
  historyList.value.unshift(searchContent.value)
  limitLength()
  // 接口，待联调
}, 500)

// 删除单个历史记录
function remove(index: number) {
  historyList.value.splice(index, 1)
}

// 点击历史记录
const setSearch = debounce((value: string, index: number) => {
  // 设置搜索内容，并将当前搜索内容更新到列表最前面
  searchContent.value = value
  remove(index)
  handleSearch()
}, 500)

// 限制历史记录的数量
function limitLength() {
  if (historyList.value && historyList.value.length > config.maxLength)
    historyList.value.pop()
}

// 清空历史记录
function clearHistory() {
  message.confirm({ title: '确认清空所有历史记录？' }).then(() => {
    historyList.value = []
  })
}

onMounted(() => {

})
</script>
