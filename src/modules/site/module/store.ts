import { GetterTree, MutationTree, ActionTree, Module } from 'vuex'

export type SiteState = {
}

export const state = (): SiteState  => ({
  test: null
})

export const getters: GetterTree<SiteState, SiteState> = {
}

export const mutations: MutationTree<SiteState> = {
}

export const actions: ActionTree<SiteState, SiteState> = {
  initialize ({ dispatch }) {
    console.info('Site initializing...')
    console.info('Site initialized.')
  },
}

const SiteModule: Module<any, any> = ({
  namespaced: true,
  state,
  getters,
  mutations,
  actions
})

export default SiteModule


