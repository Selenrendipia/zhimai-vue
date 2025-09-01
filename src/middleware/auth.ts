import { defineMiddleware } from '@uni-helper/vite-plugin-uni-middleware/runtime'

export default defineMiddleware((_to, _from) => {
  const user = useUserStore()
  if (!user.isLogin) {
    return '/pages/login/index'
  }
})
