import type { ConfigEnv } from 'vite'
import path from 'node:path'
import process from 'node:process'
// import { fileURLToPath, URL } from 'node:url'
import Uni from '@dcloudio/vite-plugin-uni'
import Components from '@uni-helper/vite-plugin-uni-components'
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'
import UniLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniMiddleware from '@uni-helper/vite-plugin-uni-middleware'
import UniPages from '@uni-helper/vite-plugin-uni-pages'
import UniPlatform from '@uni-helper/vite-plugin-uni-platform'
import UniPlatformModifier from '@uni-helper/vite-plugin-uni-platform-modifier'
import Optimization from '@uni-ku/bundle-optimizer'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig, loadEnv } from 'vite'
import ViteRestart from 'vite-plugin-restart'

export default async ({ command, mode }: ConfigEnv) => {
  const UnoCSS = (await import('unocss/vite')).default
  const env = loadEnv(mode, path.resolve(process.cwd()))
  const isProduction = mode === 'production'

  console.log('env', env)
  console.log('command', command)
  console.log('mode', mode)

  return defineConfig({
    base: env.VITE_BASE_URL,
    resolve: {
      alias: {
        '@': path.join(process.cwd(), './src'),
        '#': path.join(process.cwd(), './types')
      }
    },
    plugins: [
      // https://github.com/uni-helper/vite-plugin-uni-pages
      UniPages({
        exclude: ['**/components/**/**.*'],
        routeBlockLang: 'json5',
        dts: 'types/auto/uni-pages.d.ts',
        // homePage: 'src/pages/index',
        // 分包目录不能配置在pages目录下
        // pages 目录为 src/pages,
        // 是个数组，可以配置多个，但是不能为pages里面的目录
        subPackages: ['src/pages-sub']
      }),
      // https://github.com/uni-helper/vite-plugin-uni-layouts
      UniLayouts(),
      // https://github.com/uni-helper/vite-plugin-uni-manifest
      UniManifest(),
      // https://github.com/uni-helper/vite-plugin-uni-platform
      UniPlatform(),
      // https://github.com/uni-helper/vite-plugin-uni-platform-modifier
      UniPlatformModifier(),
      // https://github.com/uni-helper/vite-plugin-uni-middleware
      UniMiddleware(),
      UnoCSS(),
      Components({
        dts: 'types/auto/components.d.ts',
        dirs: ['src/components', 'src/hooks'],
        deep: true,
        // 是否把目录名作为命名空间前缀，true 时组件名为 目录名+组件名
        directoryAsNamespace: false,
        resolvers: [WotResolver()]
      }),
      AutoImport({
        imports: [
          'vue',
          'pinia',
          'uni-app',
          {
            from: 'uni-mini-router',
            imports: ['useRouter', 'useRoute', 'createRouter']
          },
          {
            from: 'wot-design-uni',
            imports: ['useToast', 'useMessage', 'useNotify', 'CommonUtil']
          }
        ],
        dts: 'types/auto/auto-imports.d.ts',
        dirs: ['src/hooks', 'src/pinia/store'],
        vueTemplate: true,
        resolvers: [WotResolver()],
        eslintrc: {
          enabled: true,
          globalsPropValue: true
        }
      }),
      // Optimization 插件需要 page.json 文件，故应在 UniPages 插件之后执行
      Optimization({
        enable: {
          'optimization': true,
          'async-import': true,
          'async-component': true
        },
        dts: {
          base: 'types/auto'
        },
        logger: false
      }),
      Uni(),
      ViteRestart({
        restart: [
          'vite.config.[jt]s'
        ]
      })
    ],
    build: {
      target: 'es6',
      cssTarget: 'chrome79',
      sourcemap: false,
      minify: isProduction ? 'esbuild' : false
    },
    esbuild: {
      drop: (env.VITE_DELETE_CONSOLE && isProduction) ? ['console', 'debugger'] : []
    },
    server: {
      host: '0.0.0.0',
      hmr: true,
      port: Number(env.VITE_APP_PORT)
    },
    optimizeDeps: {
      exclude: [
        'vue-demi'
      ]
    }
  })
}
