import { loginApi } from '@/api/user'
import { useUserStore } from '@/pinia/store/user'
import { removeToken, setToken } from '@/utils/token'

const userStore = useUserStore()

// 获取微信用户昵称头像
export async function getUserProfile() {
  return new Promise((resolve, reject) => {
    return uni.getUserProfile({
      desc: '用于完善用户资料', // 必填
      success: (profileRes) => {
        console.log('用户信息:', profileRes)
        const { nickName, avatarUrl } = profileRes.userInfo
        userStore.userProfile = {
          avatarUrl,
          nickname: nickName
        }
        return resolve(profileRes)
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err)
        return reject(err)
      }
    })
  })
}

// 登录获取 code
export async function login() {
  return new Promise((resolve, reject) => {
    return uni.login({
      provider: 'weixin',
      success: async (loginRes) => {
        // loginRes.code 即微信登录凭证
        const code = loginRes.code
        const res = await loginApi({
          code,
          ...userStore.userProfile
        })
        setToken(res.token)
        return resolve(res)
      },
      fail: (err) => {
        console.error('登录失败:', err)
        removeToken()
        return reject(err)
      }
    })
  })
}
