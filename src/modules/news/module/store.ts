import { AxiosResponse, AxiosError } from 'axios'
import axios from '@/services/axios'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
import sleep from '@/mixins/sleep'

const namespaced = true
const isDev = process && process.env && process.env.NODE_ENV === 'development'

class NewsState {
  list = { data: null, isLoading: null, error: null }
}

class NewsGetters extends Getters<NewsState> {
  get isLoading() { return this.state.list.isLoading }
  get loadingError() { return this.state.list.error }
}

class NewsMutations extends Mutations<NewsState> {
  // BANNERS LIST LOADING
  startListLoading() {
    this.state.list.isLoading = true
    this.state.list.error = null
  }
  setListLoadingSuccess(payload) {
    this.state.list.data = payload
    this.state.list.error = null
    this.state.list.isLoading = false
  }
  setListLoadingFail(err) {
    this.state.list.data = null
    this.state.list.error = err
    this.state.list.isLoading = false
  }
}

class NewsActions extends Actions<NewsState, NewsGetters, NewsMutations, NewsActions> {
  async getList(loadingIsShown: boolean) {
    return new Promise((resolve, reject) => {
      if (loadingIsShown) this.commit('startListLoading', null)

      axios.get('/api/v1/news-list')
        .then((res: AxiosResponse<any>) => {
          while (!Array.isArray(res)) res = res.data

          this.commit('setListLoadingSuccess', res)
          if (isDev) console.log('Success: load list')
          resolve()
        })
        .catch(error => {
          const errMsg = error && error.response && error.response.data && error.response.data.message || null
          this.commit('setListLoadingFail', errMsg)
          if (error && error.response) reject(error.response)
          else reject()
        })
    })
  }
}

export const NewsStore = new Module({
  namespaced,
  state: NewsState,
  getters: NewsGetters,
  mutations: NewsMutations,
  actions: NewsActions
})

export const newsMapper = createMapper(NewsStore)
