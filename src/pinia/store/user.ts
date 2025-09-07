export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)

  const setLogin = (val: boolean) => {
    isLogin.value = val
  }

  const userProfile = {
    nickname: '',
    avatarUrl: ''
  }

  return { isLogin, setLogin, userProfile }
}, {
  persist: true
})
