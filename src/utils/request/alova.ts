import type { Method } from 'alova'
import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'
import router from '@/router'
import { getGlobalData } from '../index'

const alovaInst = createAlova({
  baseURL: getGlobalData('baseURL'),
  ...AdapterUniapp(),
  beforeRequest: (method) => {
    if (['POST', 'GET'].includes(method.type)) {
      method.config.headers['Content-Type'] = 'application/json'
    }
  },
  responded: {
    onSuccess: handleSuccess,
    onError: handleError
  },
  timeout: 60000,
  cacheFor: null
})

export default alovaInst

function handleSuccess(response: UniResponse, method: Method) {
  console.log('接口成功响应: ', response)
  const { config } = method
  const { requestType } = config

  const toast = useGlobalToast()
  const { statusCode, data: rawData, errMsg } = response as UniApp.RequestSuccessCallbackResult
  if (statusCode === 401 || statusCode === 403) {
    toast.error('登录失效, 请重新登录')
    // router.replaceAll({ name: 'login' })
    return
  }

  if (requestType === 'upload' || requestType === 'download') {
    return response
  }

  if (statusCode !== 200) {
    toast.error(errMsg || '请求失败')
    throw new Error(errMsg || '请求失败')
  }

  const { data, code, msg } = rawData as ApiResponse<any>
  if (code !== 200) {
    toast.error(msg || '请求失败')
    throw new Error(msg || '请求失败')
  }
  return data
}

function handleError(error: any) {
  const toast = useGlobalToast()
  console.log('接口响应错误: ', error)
  if (error.name === 'NetworkError') {
    toast.error('网络错误, 请检查您的网络连接')
  } else if (error.name === 'TimeoutError') {
    toast.error('请求超时, 请重试')
  } else {
    toast.error('请求失败')
  }
  return error
}

function handleComplete(response: any) {

}
