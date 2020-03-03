import { AxiosResponse, AxiosError } from 'axios'
import { Supplier, ListSort, EditPayload } from '../models'
import axios from '@/services/axios'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'

const namespaced = true

class PhonesState {
  edit: { error: string, isLoading: boolean } = { error: null, isLoading: false }
  hashes: ['active', 'inactive'] = ['active', 'inactive']
  // list: { data: Supplier[], error: string, isLoading: boolean } =  { data: null, error: null, isLoading: false }
  listSort: ListSort = { by: 'id', direction: 'asc' }
  list: { data: Supplier[], error: string, isLoading: boolean } =  { 
    data: [
      { id: 0, email: 'email', inn: '12345567', name: 'Name', phone: '88888888' },
      { id: 1, email: 'amail', inn: '09887565', name: 'Came', phone: '9393939' },
      { id: 2, email: 'umail', inn: '848484848', name: 'Cate', phone: '91010101' },
      { id: 3, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
    ], 
    error: null,
    isLoading: false
  }
}

class PhonesGetters extends Getters<PhonesState> {
  get isLoading() { return this.state.list.isLoading || this.state.edit.isLoading }
  get loadingError() { return this.state.list.error || this.state.edit.error }
  get listSorted() {
    if (!this.state.list.data || !this.state.list.data.length) return

    const list = [...this.state.list.data]
    const sortBy = this.state.listSort.by
    const sortDirection = this.state.listSort.direction

    const sorted = list.sort((a,b) => {
      let sortA = a[sortBy]
      let sortB = b[sortBy]

      switch (sortBy) {
        case 'id':
          sortA = Number(sortA)
          sortB = Number(sortB)
          break

        // case 'name':
        // case 'email':
        // case 'phone':
        default:
          sortA = sortA.toString().charAt(0).toUpperCase() + sortA.toString().slice(1)
          sortB = sortB.toString().charAt(0).toUpperCase() + sortB.toString().slice(1)
          break
      }

      if ((sortA > sortB && sortDirection === 'asc') || (sortA < sortB && sortDirection === 'desc')) return 1
      else return -1
    })

    return [...sorted, ...sorted, ...sorted, ...sorted, ...sorted, ...sorted, ...sorted, ...sorted, ...sorted, ...sorted, ...sorted, ...sorted, ...sorted]
  }
}

class PhonesMutations extends Mutations<PhonesState> {
  updateListSort(payload: ListSort) {
    this.state.listSort.by = payload.by
    this.state.listSort.direction = payload.direction
  }
  startListLoading() {
    this.state.list.isLoading = true
    this.state.list.error = null
  }
  setListLoadingSuccess(payload: Supplier[]) {
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

class PhonesActions extends Actions<PhonesState, PhonesGetters, PhonesMutations, PhonesActions> {
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

export const phones = new Module({
  namespaced,
  state: PhonesState,
  getters: PhonesGetters,
  mutations: PhonesMutations,
  actions: PhonesActions
})

export const phonesMapper = createMapper(phones)
