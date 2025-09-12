<template>
  <div class="px-10 py-20 text-center">
    首页
  </div>
  <wd-button @click="navigateTo">
    跳转
  </wd-button>
</template>

<script setup lang="ts">
const router = useRouter()
const globalStore = useGlobalStore()

function navigateTo() {
  router.push({
    path: '/subPackages/collection/index'
  })
}
</script>
