// 获取 token（从本地缓存）
export function getToken() {
  return uni.getStorageSync('token') || ''
}

// 保存 token
export function setToken(token: string) {
  uni.setStorageSync('token', token)
}

// 移除 token
export function removeToken() {
  uni.removeStorageSync('token')
}
