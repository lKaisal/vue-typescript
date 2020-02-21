import { AxiosResponse, AxiosError } from 'axios'
import { Section } from '../models'
import service from '@/client/index'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'

const namespaced = true

class SectionsState {
  list: { data: Section[], error: string, isLoading: boolean } =  { data: null, error: null, isLoading: false }
}

class SectionsGetters extends Getters<SectionsState> {
  get isLoading() { return this.state.list.isLoading }
  get loadingError() { return this.state.list.error }
  get listActive() { return this.state.list.data && this.state.list.data.filter(b => b.active) }
  get listInactive() { return this.state.list.data && this.state.list.data.filter(b => !b.active) }
  get listToEdit() { return null }
}

class SectionsMutations extends Mutations<SectionsState> {
  startListLoading() {
    this.state.list.isLoading = true
    this.state.list.error = null
  }
  setListLoadingSuccess(payload: Section[]) {
    this.state.list.data = payload
    this.state.list.isLoading = false
    this.state.list.error = null
  }
  setListLoadingFail(err) {
    this.state.list.data = null
    this.state.list.isLoading = false
    this.state.list.error = err
  }
}

class SectionsActions extends Actions<SectionsState, SectionsGetters, SectionsMutations, SectionsActions> {
  async getList() {
    return new Promise((resolve, reject) => {
      this.commit('startListLoading')

      service.get('/api/v1/features-list')
        .then((res: AxiosResponse<any>) => {
          while (!Array.isArray(res)) res = res.data

          this.commit('setListLoadingSuccess', res)
          console.log('Success: load list')
          resolve()
        })
        .catch(error => {
          console.log(error.response)
          this.commit('setListLoadingFail', error.response.data.message)
          reject()
        })
    })
  }
  async editList() {
    // return new Promise((resolve, reject) => {
    //   this.commit('startListLoading')

    //   const body = this.getters.listToEdit
    //   service.post('/api/v1/featues', body)
    // })
  }
}

export const sections = new Module({
  namespaced,
  state: SectionsState,
  getters: SectionsGetters,
  mutations: SectionsMutations,
  actions: SectionsActions
})

export const sectionsMapper = createMapper(sections)
