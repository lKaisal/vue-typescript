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
      { id: 4, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 5, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 6, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 7, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 8, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 9, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 10, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 11, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 12, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 13, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 14, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 15, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 16, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 17, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 18, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 19, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 20, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 21, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 22, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 23, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 24, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 25, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 26, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 27, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 28, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 29, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 30, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 31, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 32, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 33, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 34, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 35, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 36, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 37, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 38, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 39, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 40, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 41, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 42, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 43, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 44, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 45, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 46, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 47, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 48, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 49, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 50, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 51, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 52, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 53, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 54, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 55, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 56, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 57, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 58, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 59, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 60, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 61, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 62, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 63, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 64, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
      { id: 65, email: 'imail', inn: '54958454', name: 'Date', phone: '10101010' },
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

        default:
          sortA = sortA.toString().charAt(0).toUpperCase() + sortA.toString().slice(1)
          sortB = sortB.toString().charAt(0).toUpperCase() + sortB.toString().slice(1)
          break
      }

      if ((sortA > sortB && sortDirection === 'asc') || (sortA < sortB && sortDirection === 'desc')) return 1
      else return -1
    })

    return sorted
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
