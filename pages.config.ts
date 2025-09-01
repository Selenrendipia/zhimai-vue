import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  // pages: [{
  //   path: 'pages/index/index',
  //   // 局部中间件
  //   middleware: ['auth'],
  // }],
  pages: [],
  globalStyle: {
    backgroundColor: '@bgColor',
    backgroundColorBottom: '@bgColorBottom',
    backgroundColorTop: '@bgColorTop',
    backgroundTextStyle: '@bgTxtStyle',
    navigationBarBackgroundColor: '@titleBgColor',
    navigationBarTextStyle: '@titleTxtStyle',
    navigationBarTitleText: 'Uni Creator',
    // navigationStyle: 'custom',

    // 下拉刷新配置
    enablePullDownRefresh: false,
    onReachBottomDistance: 50
  },
  easycom: {
    autoscan: true,
    custom: {
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue'
    }
  },
  // 全局中间件
  middleware: [],
  // 分包配置 多个分包多个对象
  subPackages: [
    // {
    //   root: 'pages-sub',
    //   pages: [
    //     {
    //       path: 'demo/index',
    //       style: {
    //         navigationStyle: 'default',
    //         navigationBarTitleText: '分包页面 标题',
    //       },
    //     },
    //   ],
    // },
  ]
})
