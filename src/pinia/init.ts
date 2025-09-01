/**
 * 自动导入和初始化所有store文件
 * 使用import.meta.glob动态导入store目录下的所有文件
 * 自动应用$persist持久化
 */

// 定义store模块的类型
interface StoreModule {
  [key: string]: any
}

// 定义store实例的类型
interface StoreInstance {
  $persist?: () => void
  [key: string]: any
}

// 使用vite的import.meta.glob动态导入所有store文件
// 排除index.ts和init.ts文件
const storeModules = import.meta.glob<StoreModule>(['./store/**.ts', '!./store/index.ts', '!./store/init.ts'], {
  eager: true
})

/**
 * 初始化所有store并应用持久化
 * 自动检测并初始化所有符合命名规范的store
 */
export default function initStore() {
  try {
    Object.values(storeModules).forEach((module) => {
      const storeKeys = Object.keys(module).filter(key => key.startsWith('use'))
      storeKeys.forEach((storeKey) => {
        try {
          const useStore = module[storeKey]
          if (typeof useStore === 'function') {
            const store = useStore() as StoreInstance
            if (typeof store.$persist === 'function') {
              store.$persist()
            }
          }
        } catch (err) {
          console.error(`初始化store失败: ${storeKey}`, err)
        }
      })
    })
  } catch (error) {
    console.error('初始化store失败:', error)
  }
}
