import { GetterTree, MutationTree, ActionTree, Module } from 'vuex'
import Axios, { AxiosResponse } from 'axios'
import { Banner } from '../models'

export type BannersState = {
  list: Banner[]
}

export const state = (): BannersState  => {
  return {
    list: [],
  }
}

export const getters: GetterTree<BannersState, BannersState> = {
  listSortedAndCleared(state) {
    // const cleared = state.list && state.list.filter(banner => banner.isActive)

    return state.list && state.list.sort((a, b) => {
      const keyA = a.sort
      const keyB = a.sort

      if (keyA > keyB) return 1
      else if (keyA < keyB) return -1
      else return 0
    })
  }
}

export const mutations: MutationTree<BannersState> = {
  saveList: (state, payload: Banner[]) => state.list = payload
}

export const actions: ActionTree<BannersState, BannersState> = {
  initialize({ commit }) {
    console.info('ModuleBanners initializing...')
    console.info('ModuleBanners initialized.')
  },
  uninitialize({ commit }) {
    console.info('ModuleBanners uninitializing...')
    console.info('ModuleBanners uninitialized.')
  },
  async getList({commit}) {
    return new Promise((resolve, reject) => {
      Axios.get('/api/v1/banners-list')
        .then((data: AxiosResponse<any>) => {
          if (data.status === 200) {
            commit('saveList', data.data.data)
            resolve()
          } else {
            reject()
          }
        })
    })
  }
}

const BannersModule: Module<BannersState, any> = ({
  namespaced: true,
  state,
  getters,
  mutations,
  actions
})

export default BannersModule
