<!-- 公众号图片 -->
<template>
  <image
    v-if="item.head_img_url"
    class="h-10 w-10 rounded-full" mode="aspectFill"
    src="https://img10.360buyimg.com/jmadvertisement/jfs/t1/70325/36/14954/36690/5dcd3e3bEee5006e0/aed1ccf6d5ffc764.png"
  />
  <!-- 这里可以修改为：默认使用设计的公众号图片 -->
  <div
    v-else
    class="h-10 w-10 flex items-center justify-center rounded-full bg-gray-200 text-lg text-gray-400"
  >
    {{ '知' }}
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  item: {
    type: Object as any
  }
})
</script>
