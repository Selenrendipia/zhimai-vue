<template>
  <div class="pt-30rpx">
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
      <div v-if="showHistory" class="absolute box-border w-100% px-40rpx py-30rpx">
        <div class="item-center flex justify-between py-10rpx">
          <text class="text-40rpx font-bold">
            历史记录
          </text>
          <wd-icon name="delete-thin" size="40rpx" @click="clearHistory" />
        </div>

        <div>
          <div
            v-for="(item, index) in historyList" :key="index"
            class="my-30rpx flex items-center justify-between rounded-20rpx bg-white px-20rpx"
          >
            <text class="w-550rpx overflow-hidden text-ellipsis py-20rpx" @click="setSearch(item, index)">
              {{ item }}
            </text>
            <wd-icon name="close" @click="remove(index)" />
          </div>
        </div>
      </div>
      <!-- 查询结果 -->
      <div v-else class="absolute box-border w-100% px-40rpx py-30rpx">
        查询结果列表，封装复用活动列表组件
        <view v-for="index in num" :key="index" class="list-item">
          <image
            src="https://img10.360buyimg.com/jmadvertisement/jfs/t1/70325/36/14954/36690/5dcd3e3bEee5006e0/aed1ccf6d5ffc764.png"
          />
          <view class="right">
            这是一条测试{{ index + 1 }}
          </view>
        </view>
        <wd-loadmore :state="state" @reload="loadmore" />
      </div>
    </div>
  </div>
  <wd-message-box />
</template>

<script setup lang="ts">
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { useMessage } from 'wot-design-uni'
import { debounce } from 'wot-design-uni/components/common/util'

import { historyConfig as config } from '@/config'

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
// 列表加载状态
const state = ref<string>('loading')
// 当前列表数量
const num = ref<number>(0)
// 列表最大数量（接口联调，可能会没有最大数量）
const max = ref<number>(60)

onReachBottom(() => {
  if (num.value < max.value) {
    loadmore()
  } else if (num.value === max.value) {
    state.value = 'finished'
  }
})

onLoad(() => {
  loadmore()
})

function loadmore() {
  setTimeout(() => {
    num.value = num.value + 15
    state.value = 'loading'
  }, 200)
}
</script>

<style scoped lang="scss">
.list-item {
  position: relative;
  display: flex;
  padding: 10px 15px;
  background: #fff;
  color: #464646;
}

.list-item:after {
  position: absolute;
  display: block;
  content: '';
  height: 1px;
  left: 0;
  width: 100%;
  bottom: 0;
  background: #eee;
  transform: scaleY(0.5);
}
image {
  display: block;
  width: 120px;
  height: 78px;
  margin-right: 15px;
}
.right {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}
</style>
