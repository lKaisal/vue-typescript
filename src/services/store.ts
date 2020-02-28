import Vue from 'vue'
import Vuex from 'vuex'
import system from '@/modules/system/module/store'

Vue.use(Vuex as any)

export default new Vuex.Store<any>({
  modules: {
    system
  }
})
