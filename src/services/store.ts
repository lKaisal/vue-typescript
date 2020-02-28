import Vue from 'vue'
import Vuex from 'vuex'
import store from '@/modules/system/module/store'

Vue.use(Vuex as any)

export default new Vuex.Store<any>({
  modules: {
    system: store
  }
})
