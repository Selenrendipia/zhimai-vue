import { defineStore } from 'pinia'

interface GlobalToastOptions {
  title?: string
  icon?: 'success' | 'error' | 'loading' | 'none'
  duration?: number
  mask?: boolean
}

export const useGlobalToast = defineStore('global-toast', () => {
  const show = (option: GlobalToastOptions | string) => {
    const opts = typeof option === 'string' ? { title: option } : option
    uni.showToast({
      title: opts.title || '',
      icon: opts.icon || 'none',
      duration: opts.duration || 2000,
      mask: opts.mask ?? false
    })
  }

  const success = (option: GlobalToastOptions | string) => {
    const opts = typeof option === 'string' ? { title: option } : option
    show({ icon: 'success', duration: 1500, ...opts })
  }

  const error = (option: GlobalToastOptions | string) => {
    const opts = typeof option === 'string' ? { title: option } : option
    show({ icon: 'error', ...opts })
  }

  const info = (option: GlobalToastOptions | string) => {
    const opts = typeof option === 'string' ? { title: option } : option
    show({ icon: 'none', ...opts })
  }

  const loading = (option: GlobalToastOptions | string) => {
    const opts = typeof option === 'string' ? { title: option } : option
    uni.showLoading({
      title: opts.title || '加载中...',
      mask: opts.mask ?? true
    })
  }

  const hide = () => {
    uni.hideToast()
    uni.hideLoading()
  }

  return {
    show,
    success,
    error,
    info,
    loading,
    hide
  }
}, {
  persist: false
})
