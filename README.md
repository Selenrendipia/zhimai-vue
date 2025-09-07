# Uni-Vue3-Vite 项目

基于 Vue 3、TypeScript、Vite 和 uni-app 构建的跨平台应用模板，支持微信小程序、H5 等多平台。

## 项目介绍

这是一个使用现代前端技术栈构建的 uni-app 项目模板，集成了以下特性：

- **Vue 3**：使用 Vue 3 组合式 API 开发
- **TypeScript**：提供类型安全的开发体验
- **Vite**：快速的开发构建工具
- **Pinia**：Vue 3 的状态管理方案
- **uni-mini-router**：小程序路由管理
- **Alova**：HTTP 请求库
- **UnoCSS**：原子化 CSS 框架
- **Wot Design Uni**：UI 组件库
- **ESLint**：代码规范检查

## 环境要求

- Node.js >= 20
- pnpm (推荐的包管理器)/yarn

## 项目运行

### 安装依赖

```bash
npm install / pnpm install / yarn install
```

### 开发模式

运行 H5 版本：

```bash
npm run dev:h5 / pnpm dev:h5
```

运行微信小程序版本：(运行方式：等待构建完成后打开 微信开发者工具,  导入 dist\dev\mp-weixin 运行)

```bash
npm run dev:wx / pnpm dev:wx
```

### 构建项目

构建 H5 版本：

```bash
npm run build:h5 / pnpm build:h5
```

构建微信小程序版本(发布：等待构建完成后打开 微信开发者工具,  导入 dist\dev\mp-weixin 上传发布)：

```bash
npm run build:wx / pnpm build:wx
```

## 项目结构

```
uni-vue3-vite/
├── src/                    # 源代码
│   ├── api/                # API 接口定义
│   ├── components/         # 公共组件
│   ├── hooks/              # 自定义 Hooks
│   ├── pages/              # 主包页面
│   ├── pages-sub/          # 分包页面
│   ├── router/             # 路由配置
│   ├── static/             # 静态资源
│   ├── store/              # Pinia 状态管理
│   ├── utils/              # 工具函数
│   ├── App.vue             # 应用入口组件
│   ├── config.ts           # 应用配置
│   ├── main.ts             # 应用入口
│   ├── manifest.json       # 应用配置文件
│   ├── pages.json          # 页面配置
│   └── uni.scss            # 全局样式
├── types/                  # TypeScript 类型定义
├── .vscode/                # VS Code 配置
├── manifest.config.ts      # manifest 配置
├── pages.config.ts         # 页面配置
├── vite.config.ts          # Vite 配置
└── ...
```

## 使用指南

### 修改 manifest 配置

项目使用了 `@uni-helper/vite-plugin-uni-manifest` 插件来管理 manifest 配置。主要配置在 `manifest.config.ts` 文件中：

```typescript
// manifest.config.ts
import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'
import appConfig from './src/config'

export default defineManifestConfig({
  'name': appConfig.appName,
  'appid': appConfig.appId,
  // 其他配置...
})
```

应用基础信息在 `src/config.ts` 中定义：

```typescript
// src/config.ts
export default {
  baseURL: 'https://api.alovajs.org',
  appId: 'wx4cff20925919bd8a',
  appName: 'uniapp-template',
  appDescription: 'uniapp-template',
  appVersion: '1.0.0',
  appVersionCode: '100',
}
```

### 添加新页面
**tabBar页面放置在主包中，其他子页面放置在分包中**
1. 在 `src/page.json`中添加以下代码
```json
  {
    // 页面路由配置
    "pages": [
      ...,
      {
        "path": "pages/XXX/index",         //自定义文件夹
        //不会被识别，约定：home-首页 page-普通页面 sub-分包页面
        "type": "page",
        "name": "XXX",                     //唯一路由名
        "style": {
          "navigationStyle": "default",
          "navigationBarTitleText": "XX"   //tabBar名
        }
      }
    ],
    // tabBar配置
    "tabBar": {
      ...,
      "list": [
        ...,
        {
          "pagePath": "同page的path",
          "iconPath": "static/tabbar/XX.png",     //tabBar未激活时的图片
          "selectedIconPath": "static/tabbar/XX-active.png",  // 激活时的图片
          "text": "个人中心"
        }
      ]
    },
    // 分包页面路径
    "subPackages": [
      {
        "root": "subPackages",    //分包的根路径
        "pages": [
          // 参数跟上面的pages一致
        ]
      }
    ]
  }
```

补充：
```js
// pages中type的使用
const routes = useRouter().getRoutes()
const homePage = routes.find(r => r.type === 'home')

if (currentRoute.meta.type === 'home') {
  // 显示某些组件
}

```
2. 在 `src/pages` 目录下创建对应的 文件夹 和 Vue 文件
```vue
<template>
  <view class="">
    <!-- 页面内容 -->
  </view>
</template>

<script setup lang="ts">
// 页面逻辑
</script>

<style lang="scss" scoped>
/* 页面样式 */
</style>
```

### API 请求

项目使用 Alova 作为 HTTP 请求库，封装在 `src/utils/request` 目录中。
**公共接口不需要添加额外的请求头，部分接口需要，则在设置请求api的第三个参数为true**

#### 定义 API

在 `src/api` 目录下创建对应的 API 文件：

```typescript
// src/api/user.ts
import { get, post } from '@/utils/request'

export function getUserInfo() {
  return get<UserInfo>('/user/info')
}

export function login(params: LoginParams) {
  return post<LoginResponse>('/user/login', params)
}
```

#### 使用 API

```typescript
import { getUserInfo } from '@/api'

// 在组件中使用
const fetchData = async () => {
  try {
    const data = await getUserInfo()
    // 处理数据
  } catch (error) {
    // 处理错误
  }
}
```

### Pinia 状态管理

项目使用 Pinia 进行状态管理，并集成了持久化插件。

#### 定义 Store

```typescript
// src/store/user.ts
export const useUserStore = defineStore('user', () => {
  const isLogin = ref(false)

  const setLogin = (val: boolean) => {
    isLogin.value = val
  }

  return { isLogin, setLogin }
}, {
  persist: true, // 开启持久化
})
```

#### 使用 Store

```typescript
// 在组件中使用
const userStore = useUserStore()

// 读取状态
console.log(userStore.isLogin)

// 修改状态
userStore.setLogin(true)
```

#### 使用 toast
@/hooks/useGlobalToast.ts中封装了uni.Toast组件
使用方法：
```js
import { useGlobalToast } from '@/hooks/useGlobalToast'
const globalToast = useGlobalToast()

globalToast.error('登录已过期，请重新登录')
```

### 路由导航

项目使用 uni-mini-router 进行路由管理。

```typescript
// 页面跳转
const router = useRouter()

// 普通跳转
router.push('/pages/index/index')

// 带参数跳转
router.push({
  path: '/pages-sub/demo/index',
  query: {
    id: '123'
  }
})

// 获取路由参数
const route = useRoute()
console.log(route.query)
```

### UI 组件库

项目集成了 Wot Design Uni 组件库，可以直接使用：

```vue
<template>
  <wd-button @click="handleClick">按钮</wd-button>
</template>
```

### 全局数据共享

使用 Pinia 的 globalStore 进行全局数据共享：

```typescript
// 设置全局数据
const globalStore = useGlobalStore()
globalStore.setGlobalData('key', value)

// 获取全局数据
const value = globalStore.globalData.key
```

### UnoCSS 使用指南

项目集成了 UnoCSS 原子化 CSS 框架，可以快速构建界面样式。

#### 基本用法

在模板中直接使用预定义的原子类：

```vue
<template>
  <view class="px-10 py-20 text-center bg-white rounded-lg shadow-md">
    <text class="text-lg font-bold text-primary">标题文本</text>
    <view class="mt-4 flex justify-between items-center">
      <text class="text-gray-500">左侧内容</text>
      <text class="text-sm text-gray-400">右侧内容</text>
    </view>
  </view>
</template>
```

#### 常用原子类

- **布局**：`flex`, `grid`, `block`, `inline-block`, `hidden`
- **弹性布局**：`flex-row`, `flex-col`, `justify-center`, `items-center`, `space-x-2`
- **尺寸**：`w-full`, `h-10`, `max-w-md`, `min-h-screen`
- **间距**：`m-4` (margin), `p-4` (padding), `mt-2` (margin-top), `pb-3` (padding-bottom)
- **颜色**：`text-primary`, `bg-white`, `border-gray-200`
- **字体**：`text-sm`, `font-bold`, `italic`, `text-center`
- **边框**：`border`, `border-2`, `rounded-lg`, `rounded-full`
- **阴影**：`shadow-sm`, `shadow-md`, `shadow-lg`

#### 响应式设计

```vue
<view class="w-full md:w-1/2 lg:w-1/3">
  <!-- 在小屏幕上宽度100%，中等屏幕上50%，大屏幕上33.3% -->
</view>
```

#### 状态变体

```vue
<button class="bg-blue-500 hover:bg-blue-700 active:bg-blue-800">
  按钮
</button>
```

#### 组合变体

UnoCSS 支持变体组合，可以更简洁地编写复杂样式：

```vue
<view class="hover:(bg-gray-100 text-blue-500)">
  <!-- 鼠标悬停时同时改变背景色和文字颜色 -->
</view>
```

#### 安全区适配

项目中已定义了安全区适配的原子类：

```vue
<view class="pb-safe">
  <!-- 底部安全区域适配 -->
</view>
```

#### 自定义主题

项目配置了主题色，可以直接使用：

```vue
<view class="text-primary bg-primary/10">
  <!-- 使用主题色文本和10%透明度的主题色背景 -->
</view>
```

#### 适配暗黑模式
theme.json中设置背景主题色的参数
manifest.json中设置：
```json
{
    "darkmode": true,
    "themeLocation": "theme.json"
  }
```

#### 指令使用

UnoCSS 支持在样式中使用 `@apply` 指令：

```vue
<style>
.custom-component {
  @apply px-4 py-2 bg-white rounded-lg shadow;
}
</style>
```

## 代码片段

项目在 `.vscode/`目录下提供了常用的代码片段，例如 `univ3` 可以快速创建 uni-app Vue 3 页面模板。

## 项目特性

- 自动导入：无需手动导入 Vue、Pinia、uni-app API 等
- 原子化 CSS：使用 UnoCSS 快速构建界面
- TypeScript 支持：完整的类型定义和类型检查
- ESLint 集成：代码规范检查
- 自动生成路由：基于文件系统的路由生成
- 中间件支持：可配置全局和局部中间件
- 分包支持：优化小程序包大小
- 持久化存储：Pinia 状态自动持久化
