<template>
  <div class="container">
    <div class="header">
      <div class="left">
        <image class="avatar" src="/src/static/self-center/user.png" />
        <text>点击登陆</text>
      </div>
      <div class="right">
        <wd-button size="small" type="info">
          编辑资料
        </wd-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const globalStore = useGlobalStore()

onMounted(() => {

})
</script>

<style scoped lang="scss">
.container {
  padding: 20rpx 40rpx 0;
  width: calc(100% - 80rpx);
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      .avatar {
        border-radius: 100%;
        width: 100rpx;
        height: 100rpx;
        margin-right: 20rpx;
      }
    }
  }
}
</style>
