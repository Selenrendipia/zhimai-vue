export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)

  const setLogin = (val: boolean) => {
    isLogin.value = val
  }

  return { isLogin, setLogin }
}, {
  persist: true
})
