import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(createPersistedState({
  key: id => `uni_${id}`,
  storage: {
    getItem: uni.getStorageSync,
    setItem: uni.setStorageSync
  }
}))

export default pinia
