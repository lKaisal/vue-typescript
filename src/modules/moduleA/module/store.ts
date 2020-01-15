import { GetterTree, MutationTree, ActionTree, Module } from 'vuex'

export type AState = {
}

export const state = (): AState  => ({
  test: null
})

export const getters: GetterTree<AState, AState> = {
}

export const mutations: MutationTree<AState> = {
}

export const actions: ActionTree<AState, AState> = {
  initialize ({ commit }) {
    console.info('ModuleA initializing...')
    console.info('ModuleA initialized.')
  },
  uninitialize ({ commit }) {
    console.info('ModuleA uninitializing...')
    console.info('ModuleA uninitialized.')
  }
}

const AModule: Module<any, any> = ({
  namespaced: true,
  state,
  getters,
  mutations,
  actions
})

export default AModule
