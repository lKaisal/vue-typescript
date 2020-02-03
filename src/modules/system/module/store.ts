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
      // Store.registerModule(module.name, module.store)
      registerModule(Store, [module.name], `${module.name}/`, module.store)
      Router.addRoutes(module.routes)
      // console.log(Router, module.routes)
      // dispatch(module.name + '/initialize', null, { root: true })
    },
    removeModule ({ dispatch }, module: any) {
      // dispatch(module.name + '/uninitialize', null, { root: true })
      Store.unregisterModule(module.name)
    }
  }
}
