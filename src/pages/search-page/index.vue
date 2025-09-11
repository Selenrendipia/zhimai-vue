<template>
  <div class="pt-4">
    <wd-search
      v-model="searchContent"
      cancel-txt="搜索"
      placeholder="请输入"
      placeholder-left
      light :maxlength="30"
      @focus="showHistory = true"
      @search="handleSearch"
      @cancel="handleSearch"
      @clear="showHistory = true"
    />
    <div class="relative">
      <!-- 历史记录 -->
      <div v-if="showHistory" class="absolute box-border w-100% px-5 py-4">
        <div class="item-center flex justify-between py-1">
          <div class="text-5 font-bold">
            历史记录
          </div>
          <wd-icon name="delete-thin" size="40rpx" @click="clearHistory" />
        </div>

        <div>
          <div
            v-for="(item, index) in historyList" :key="index"
            class="my-4 flex items-center justify-between rounded-3 bg-white px-3"
          >
            <div class="w-70 overflow-hidden text-ellipsis py-3" @click="setSearch(item, index)">
              {{ item }}
            </div>
            <wd-icon name="close" @click="remove(index)" />
          </div>
        </div>
      </div>
      <!-- 查询结果 -->
      <div v-else class="absolute box-border w-100% px-5 py-4">
        <div class="py-4 text-5 font-bold">
          搜索结果
        </div>
        <InfoList />
      </div>
    </div>
  </div>
  <wd-message-box />
</template>

<script setup lang="ts">
import { useMessage } from 'wot-design-uni'
import { debounce } from 'wot-design-uni/components/common/util'
import { historyConfig as config } from '@/config'
import InfoList from './component/InfoList.vue'

const message = useMessage()

const router = useRouter()
const globalStore = useGlobalStore()
const searchContent = ref<string>('')
const historyList = ref<Array<string>>([
  'aaaaa11',
  'bbbb222',
  'cccc3333333333333333333333333333333333333333333333333333333333333'
])
const showHistory = ref<boolean>(true)

// 点击搜索/回车
const handleSearch = debounce(() => {
  search()
}, 500)

// 搜索
function search() {
  searchContent.value = searchContent.value.trim()
  if (!searchContent.value)
    return
  showHistory.value = false
  historyList.value.unshift(searchContent.value)
  limitLength()
  // 接口，待联调
}

// 删除单个历史记录
function remove(index: number) {
  historyList.value.splice(index, 1)
}

// 点击历史记录
const setSearch = debounce((value: string, index: number) => {
  // 设置搜索内容，并将当前搜索内容更新到列表最前面
  searchContent.value = value
  remove(index)
  search()
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
