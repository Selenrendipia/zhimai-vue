import type { AppData } from '@dcloudio/uni-app'

/**
 * 获取当前页面路径
 * @returns 当前页面路径
 */
export function getCurrentPath() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage.route || ''
}

export function setGlobalData(key: string, value: any, instance: any = getApp<AppData>()) {
  const app = instance || getCurrentInstance()?.proxy
  app.globalData[key] = value
}

export function getGlobalData(key: string, instance: any = getApp<AppData>()) {
  const app = instance || getCurrentInstance()?.proxy
  return app.globalData[key]
}
