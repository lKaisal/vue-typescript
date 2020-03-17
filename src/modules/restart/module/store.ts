import { AxiosResponse, AxiosError } from 'axios'
import { Service, ListSort, EditPayload } from '../models'
import axios from '@/services/axios'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'

const namespaced = true
const isDev = process && process.env && process.env.NODE_ENV === 'development'

class RestartState {
  edit: { error: string, isLoading: boolean } = { error: null, isLoading: false }
  hashes: ['active', 'inactive'] = ['active', 'inactive']
  list: { data: Service[], error: string, isLoading: boolean } =  { data: null, error: null, isLoading: false }
  listSort: ListSort = { by: 'serviceName', direction: 'asc' }
}

class RestartGetters extends Getters<RestartState> {
  get isLoading() { return this.state.list.isLoading || this.state.edit.isLoading }
  get loadingError() { return this.state.list.error || this.state.edit.error }
  get listSorted() {
    if (!this.state.list.data || !this.state.list.data.length) return

    const list = [...this.state.list.data]
    const sortBy = this.state.listSort.by
    const sortDirection = this.state.listSort.direction

    return list.sort((a,b) => {
      let sortA = a[sortBy]
      let sortB = b[sortBy]

      switch (sortBy) {
        case 'serviceName':
          sortA = sortA.toString().toLowerCase()
          sortB = sortB.toString().toLowerCase()
          break

        case 'replicas':
          sortA = Number(sortA)
          sortB = Number(sortB)
          break
      }

      if ((sortA > sortB && sortDirection === 'asc') || (sortA < sortB && sortDirection === 'desc')) return 1
      else return -1
    })
  }
}

class RestartMutations extends Mutations<RestartState> {
  updateListSort(payload: ListSort) {
    this.state.listSort.by = payload.by
    this.state.listSort.direction = payload.direction
  }
  startListLoading() {
    this.state.list.isLoading = true
    this.state.list.error = null
  }
  setListLoadingSuccess(payload) {
    this.state.list.data = payload
    this.state.list.isLoading = false
    this.state.list.error = null
  }
  setListLoadingFail(err) {
    this.state.list.data = null
    this.state.list.isLoading = false
    this.state.list.error = err
  }
  startEdit() {
    this.state.edit.error = null
    this.state.edit.isLoading = true
  }
  setEditSuccess(list) {
    this.state.list.data = list
    this.state.edit.error = null
    this.state.edit.isLoading = false
  }
  setEditFail(err) {
    this.state.edit.error = err
    this.state.edit.isLoading = false
  }
}

class RestartActions extends Actions<RestartState, RestartGetters, RestartMutations, RestartActions> {
  async getList() {
    return new Promise((resolve, reject) => {
      this.commit('startListLoading')

      axios.get('/api/v1/services-list')
        .then((res: AxiosResponse<any>) => {
          while (res && !Array.isArray(res)) res = res.data

          this.commit('setListLoadingSuccess', res)
          if (isDev) console.log('Success: load list')
          resolve()
        })
        .catch(error => {
          const errMsg = error.response && error.response.data && error.response.data.message || null
          this.commit('setListLoadingFail', errMsg)
          reject(error.response)
        })
    })
  }
  async editList(payload: EditPayload) {
    return new Promise((resolve, reject) => {
      this.commit('startEdit')

      axios.post('/api/v1/services', payload)
        .then(async (res) => {
          if (isDev) console.log('Success: edit list')
          while (res && !Array.isArray(res)) res = res.data
          // await this.dispatch('getList', null)
          this.commit('setEditSuccess', res)
          resolve()
        })
        .catch(error => {
          if (isDev && error) console.log(error.response)
          else console.log('error')

          const errMsg = error.response && error.response.data && error.response.data.message || null
          this.commit('setEditFail', errMsg)
          reject()
        })
    })
  }
}

export const restart = new Module({
  namespaced,
  state: RestartState,
  getters: RestartGetters,
  mutations: RestartMutations,
  actions: RestartActions
})

export const restartMapper = createMapper(restart)
