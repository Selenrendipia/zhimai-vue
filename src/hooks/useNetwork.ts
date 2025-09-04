export const initNetwork = () => {
    uni.getNetworkType({
        success: (res) => {
            if (res.networkType === 'none') {
                return Promise.reject(new Error('无网络连接'));
            }
        },
        fail: () => {
          return Promise.reject(new Error('无法获取网络状态'));
        }
    })
}