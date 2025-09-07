/// <reference types="vite/client" />

declare module '@dcloudio/uni-app' {
  interface AppData {
    globalData: {
      [key: string]: any
    }
  }
}

export {}

declare global {
  interface AppConfig {
    baseURL: string
    appName: string
    appId: string
    [key: string]: any
  }

  type UniResponse = UniApp.RequestSuccessCallbackResult | UniApp.UploadFileSuccessCallbackResult
    | UniApp.DownloadSuccessData

  type CustomRequestOptions = UniApp.RequestOptions & {
    query?: Record<string, any>
    /** 出错时是否隐藏错误提示 */
    hideToast?: boolean
  } & IUniUploadFileOptions

  interface ApiResponse<T> {
    code: number
    message?: string
    msg?: string
    data: T
    [key: string]: any
  }
}
