import { GetterTree, MutationTree, ActionTree, Module } from 'vuex'

import Store from '../../../services/store'
import Router from '../../../services/router'
import siteModule from '../../site/module'

export type MainState = {
}

export const state = (): MainState  => ({
  test: null
})

export const getters: GetterTree<MainState, MainState> = {
}

export const mutations: MutationTree<MainState> = {
}

export const actions: ActionTree<MainState, MainState> = {
  initialize ({ dispatch }) {
    console.info('System initializing...')
    console.info('System initialized.')
    dispatch('initializeModule', siteModule)
  },
  initializeModule ({ dispatch }, module) {
    Store.registerModule(module.name, module.store)
    Router.addRoutes(module.routes)
    dispatch(module.name + '/initialize', null, { root: true })
  },
  removeModule ({ dispatch }, module) {
    dispatch(module.name + '/uninitialize', null, { root: true })
    Store.unregisterModule(module.name)
  }
}

const MainModule: Module<any, any> = ({
  namespaced: true,
  state,
  getters,
  mutations,
  actions
})

export default MainModule

