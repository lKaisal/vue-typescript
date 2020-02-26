import Store from '../../../services/store'
import Router from '../../../services/router'
import { registerModule, unregisterModule } from 'vuex-smart-module'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    initializeModule ({ dispatch }, module: any) {
      registerModule(Store, [module.name], `${module.name}/`, module.store)
      Router.addRoutes(module.routes)
    },
    removeModule ({ dispatch }, module: any) {
      Store.unregisterModule(module.name)
    }
  }
}
