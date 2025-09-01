/// <reference types="@uni-helper/vite-plugin-uni-pages/client" />
import type { PageMetaDatum, SubPageMetaDatum } from '@uni-helper/vite-plugin-uni-pages'
// 引入uni-parse-pages
import pagesJsonToRoutes from 'uni-parse-pages'
import { pages, subPackages } from 'virtual:uni-pages'
// 导入pages.json
import pagesJson from '../pages.json'

// console.log('pages', pages)
// console.log('subPackages', subPackages)

function generateRoutes(pages: PageMetaDatum[], subPackages: SubPageMetaDatum[]) {
  const routes = pages.map((page) => {
    const newPath = `/${page.path}`
    return {
      ...page,
      path: newPath
    }
  })
  if (subPackages && subPackages.length > 0) {
    subPackages.forEach((subPackage) => {
      const subPackageRoutes = subPackage.pages.map((page) => {
        const newPath = `/${subPackage.root}/${page.path}`
        return {
          ...page,
          path: newPath
        }
      })
      routes.push(...subPackageRoutes)
    })
  }
  return routes
}

// const routes: PageMetaDatum[] = generateRoutes(pages, subPackages)
const routes = pagesJsonToRoutes(pagesJson)
console.log('routes', routes)
const router = createRouter({
  routes: [...routes]
})

router.beforeEach((to, from, next) => {
  // console.log('🚀 beforeEach', { to, from })
  next()
})

router.afterEach((to, from) => {
  // console.log('🎯 afterEach', { to, from })
})

export default router
