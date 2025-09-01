import { createSSRApp } from 'vue'
import App from './App.vue'
import pinia from './pinia'
import initStore from './pinia/init'
import router from './router'
import 'core-js/actual/array/iterator'
import 'core-js/actual/promise'
import 'core-js/actual/object/assign'
import 'core-js/actual/promise/finally'
import 'uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia).use(router)
  initStore()
  return {
    app
  }
}
