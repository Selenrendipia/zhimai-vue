import { defineStore } from 'pinia'

export interface CategoryMenuItem {
  title: string
  list: string[]
  choose: boolean[]
  choosenum: number
}

export interface CategoryState {
  topClassifyIndex: number
  menu: CategoryMenuItem[]
}

export const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    topClassifyIndex: 0,
    menu: []
  }),
  actions: {
    setTopClassifyIndex(idx: number) {
      this.topClassifyIndex = idx
    },
    setMenu(menu: CategoryMenuItem[]) {
      this.menu = menu
    }
  },
  persist: true
})
