import appConfig from '@/config'

export const useGlobalStore = defineStore('global', () => {
  const globalData = reactive<AppConfig>(appConfig)
  const setGlobalData = (key: string, value: any) => {
    globalData[key] = value
  }

  const getGlobalData = (key: string) => {
    return globalData[key]
  }

  return { globalData, setGlobalData, getGlobalData }
}, {
  persist: true
})
