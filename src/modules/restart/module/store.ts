import { AxiosResponse, AxiosError } from 'axios'
import { Service, ListSort, EditPayload } from '../models'
import axios from '@/services/axios'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'

const namespaced = true

class RestartState {
  edit: { error: string, isLoading: boolean } = { error: null, isLoading: false }
  hashes: ['active', 'inactive'] = ['active', 'inactive']
  list: { data: Service[], error: string, isLoading: boolean } =  { data: null, error: null, isLoading: false }
  listSort: ListSort = { by: 'serviceName', direction: 'asc' }
  // list: { data: Service[], error: string, isLoading: boolean } =  { data: [{active: true, createdAt: '20-02-2020', description: 'description', feature: 'Feature', id: 1, name: 'Name', updatedAt: '20-02-2020', username: 'Username'}], error: null, isLoading: false }
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
          sortA = sortA.toString().charAt(0).toUpperCase() + sortA.toString().slice(1)
          sortB = sortB.toString().charAt(0).toUpperCase() + sortB.toString().slice(1)
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
  setListLoadingSuccess(payload: Service[]) {
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
  setEditSuccess() {
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
          while (!Array.isArray(res)) res = res.data

          this.commit('setListLoadingSuccess', res)
          console.log('Success: load list')
          resolve()
        })
        .catch(error => {
          if (error && error.response) {
            console.log(error.response)
            this.commit('setListLoadingFail', error.response.data.message)
          }
          reject()
        })
    })
  }
  async editList(payload: EditPayload) {
    return new Promise((resolve, reject) => {
      this.commit('startEdit')

      axios.post('/api/v1/services', payload)
        .then(async () => {
          console.log('Success: edit list')
          await this.dispatch('getList', null)
          this.commit('setEditSuccess')
          resolve()
        })
        .catch(error => {
          console.log(error.response)
          this.commit('setEditFail', error.response.data.message)
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
