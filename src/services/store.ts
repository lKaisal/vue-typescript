import Vue from 'vue'
import Vuex from 'vuex'
import { RootStore } from '@/modules/system/module/store'
import { createStore } from 'vuex-smart-module'

Vue.use(Vuex as any)

const store = createStore(
  RootStore,
  // {
  //   strict: process.env.NODE_ENV !== 'production'
  // }
)

export default store
