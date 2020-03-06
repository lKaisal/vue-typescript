import { AxiosResponse, AxiosError } from 'axios'
import { Supplier, ListSort, EditPayload, Country } from '../models'
import axios from '@/services/axios'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'

const namespaced = true

class SuppliersLoginState {
  countries: Country[] = [
    { name: 'Russia', code: 'RU', phoneCode: 7, mask: '999 999 99 99' },
    { name: 'Belarus', code: 'BY', phoneCode: 375, mask: '99 999 99 99' },
    { name: 'Kazakhstan', code: 'KZ', phoneCode: 7, mask: '999 999 99 99' },
    { name: 'Kyrgyzstan', code: 'KG', phoneCode: 996, mask: '99 999 99 99' },
    { name: 'Ukraine', code: 'UA', phoneCode: 380, mask: '99 999 99 99' },
    { name: 'Armenia', code: 'AM', phoneCode: 374, mask: '99 99 99 99' },
  ]
  edit: { error: string, isLoading: boolean } = { error: null, isLoading: false }
  list: { data: Supplier[], error: string, isLoading: boolean } =  { data: null, error: null, isLoading: false }
  listFiltered: Supplier[] = null
  listSort: ListSort = { by: 'createdAt', direction: 'desc' }
}

class SuppliersLoginGetters extends Getters<SuppliersLoginState> {
  get isLoading() { return this.state.list.isLoading || this.state.edit.isLoading }
  get loadingError() { return this.state.list.error || this.state.edit.error }
  get listSorted() {
    if (!this.state.list.data || !this.state.list.data.length) return

    const list = this.state.listFiltered || [...this.state.list.data]
    const sortBy = this.state.listSort.by
    const sortDirection = this.state.listSort.direction

    const sorted = list.sort((a,b) => {
      let sortA = a[sortBy]
      let sortB = b[sortBy]

      switch (sortBy) {
        case 'createdAt':
          sortA = dateParser(sortA)
          sortB = dateParser(sortB)
          break

        case 'supplierId':
        case 'userId':
          sortA = Number(sortA)
          sortB = Number(sortB)
          break

        default:
          sortA = sortA.toString().toLowerCase()
          sortB = sortB.toString().toLowerCase()
          break
      }

      if ((sortA > sortB && sortDirection === 'asc') || (sortA < sortB && sortDirection === 'desc')) return 1
      else return -1
    })

    for (const item of sorted) {
      for (const field in item) {
        field.toString()
      }
    }

    return sorted
  }
}

class SuppliersLoginMutations extends Mutations<SuppliersLoginState> {
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
  setListFiltered(payload) {
    this.state.listFiltered = payload
  } 
}

class SuppliersLoginActions extends Actions<SuppliersLoginState, SuppliersLoginGetters, SuppliersLoginMutations, SuppliersLoginActions> {
  async getList() {
    return new Promise((resolve, reject) => {
      this.commit('startListLoading')

      axios.get('/api/v1/suppliers-list')
        .then((res: AxiosResponse<any>) => {
          while (!Array.isArray(res)) res = res.data

          this.commit('setListLoadingSuccess', res)
          console.log('Success: load list')
          resolve()
        })
        .catch(error => {
          if (error && error.response) {
            console.log(error.response)
            const errMsg = error.response && error.response.data && error.response.data.message || null
            this.commit('setListLoadingFail', errMsg)
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
          const errMsg = error.response && error.response.data && error.response.data.message || null
          this.commit('setEditFail', errMsg)
          reject()
        })
    })
  }
}

const dateParser = (date) => {
  const dateParser = /(\d{2})\-(\d{2})\-(\d{4}) (\d{2}):(\d{2})/;
  const match = date.match(dateParser);
  const newDate = new Date(
      Number(match[3]),  // year
      Number(match[2])-1,  // monthIndex
      Number(match[1]),  // day
      Number(match[4]),  // hours
      Number(match[5]),  // minutes
  );

  return Date.parse(newDate.toString())
}

export const suppliers = new Module({
  namespaced,
  state: SuppliersLoginState,
  getters: SuppliersLoginGetters,
  mutations: SuppliersLoginMutations,
  actions: SuppliersLoginActions
})

export const suppliersMapper = createMapper(suppliers)
