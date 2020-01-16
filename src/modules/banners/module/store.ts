import { GetterTree, MutationTree, ActionTree, Module } from 'vuex'
import Axios from 'axios'

export type BannersState = {
}

export const state = (): BannersState  => ({
  test: null
})

export const getters: GetterTree<BannersState, BannersState> = {
}

export const mutations: MutationTree<BannersState> = {
}

export const actions: ActionTree<BannersState, BannersState> = {
  initialize ({ commit }) {
    console.info('ModuleBanners initializing...')
    console.info('ModuleBanners initialized.')
  },
  uninitialize ({ commit }) {
    console.info('ModuleBanners uninitializing...')
    console.info('ModuleBanners uninitialized.')
  },
  getBannersList() {
    Axios.get('http://api.sm-admin-banner-service.svc.k8s.devel/api/v1/banners-list')
      .then((res) => console.log(res))
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
