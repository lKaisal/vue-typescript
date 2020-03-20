import { AxiosResponse, AxiosError } from 'axios'
import { Supplier, ListSort, EditPayload, Country, EditResponse, SmsFields } from '../models'
import axios from '@/services/axios'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
import sleep from '@/mixins/sleep'

const namespaced = true
const isDev = process && process.env && process.env.NODE_ENV === 'development'

class SuppliersState {
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
  identity: { data: SmsFields, error: string, isLoading: boolean} = {
    data: null,
    error: null,
    isLoading: false
  }
}

class SuppliersGetters extends Getters<SuppliersState> {
  get isLoading() { return this.state.list.isLoading || this.state.edit.isLoading || this.state.identity.isLoading }
  get loadingError() { return this.state.list.error || this.state.edit.error || this.state.identity.error }
  get supplierByUserId() {
    return (userId: Supplier['userId']) => this.state.list.data.find(s => s.userId === userId)
  }
  get listSorted() {
    if (!this.state.list.data || !this.state.list.data.length) return

    const list = this.state.listFiltered && [...this.state.listFiltered] || [...this.state.list.data]
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
        case 'inn':
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

    return sorted
  }
}

class SuppliersMutations extends Mutations<SuppliersState> {
  // List sort, filter
  updateListSort(payload: ListSort) {
    this.state.listSort.by = payload.by
    this.state.listSort.direction = payload.direction
  }
  setListFiltered(payload) {
    this.state.listFiltered = payload
  } 
  // Mutations List loading
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
  // Mutations edit
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
  // Mutations load identity
  startIdentityLoading() {
    this.state.identity.isLoading = true
    this.state.identity.error = null
  }
  setIdentityLoadingSuccess(payload: SmsFields) {
    this.state.identity.data = payload
    this.state.identity.isLoading = false
    this.state.identity.error = null
  }
  setIdentityLoadingFail(err) {
    this.state.identity.data = null
    this.state.identity.isLoading = false
    this.state.identity.error = err
  }
  clearIdentity() {
    this.state.identity.data = null
  }
  // Mutations Update supplier (not used)
  updateSupplier(payload: EditResponse) {
    const supplier = this.state.list.data.find(s => s.userId === payload.userId)
    supplier.phone = payload.phone
    supplier.phoneAuthId = payload.phoneAuthId
  }
}

class SuppliersActions extends Actions<SuppliersState, SuppliersGetters, SuppliersMutations, SuppliersActions> {
  async getList() {
    return new Promise((resolve, reject) => {
      this.commit('startListLoading')

      axios.get('/api/v1/suppliers-list')
        .then((res: AxiosResponse<any>) => {
          while (!Array.isArray(res)) res = res.data

          this.commit('setListLoadingSuccess', res)
          if (isDev) console.log('Success: load list')
          resolve()
        })
        .catch(error => {
          if (isDev && error && error.response) console.log(error.response)
          else console.log('error')

          const errMsg = error && error.response && error.response.data && error.response.data.message || null
          this.commit('setListLoadingFail', errMsg)
          if (error && error.response) reject(error.response)
          else reject()
        })
    })
  }
  async getIdentity(userId: Supplier['userId']) {
    return new Promise(async (resolve, reject) => {
      this.commit('startIdentityLoading')
      await sleep(1000)
      const res = { lastSMS: '1111', visitDate: '03-03-2020 12:00', smsAttempts: 2, isActive: true }
      this.commit('setIdentityLoadingSuccess', res)
      resolve()

      // axios.get('/api/v1/suppliers-list')
      //   .then((res: AxiosResponse<any>) => {
      //     while (!Array.isArray(res)) res = res.data

      //     this.commit('setIdentityLoadingSuccess', res)
      //     if (isDev) console.log('Success: load list')
      //     resolve()
      //   })
      //   .catch(error => {
      //     if (isDev && error && error.response) console.log(error.response)
      //     else console.log('error')

      //     const errMsg = error && error.response && error.response.data && error.response.data.message || null
      //     this.commit('setIdentityLoadingFail', errMsg)
      //     if (error && error.response) reject(error.response)
      //     else reject()
      //   })
    })
  }
  editPhone(payload: EditPayload) {
    return new Promise((resolve, reject) => {
      this.commit('startEdit')

      axios.post('/api/v1/phone', payload)
        .then((res) => {
          const data = res.data as EditResponse
          if (isDev) console.log('Success: edit phone, userId: ' + data.userId)
          this.commit('setEditSuccess')
          this.commit('updateSupplier', data)
          resolve()
        })
        .catch(error => {
          if (isDev && error && error.response) console.log(error.response)
          else console.log('error')

          const errMsg = error && error.response && error.response.data && error.response.data.message || null
          this.commit('setEditFail', errMsg)
          reject()
        })
    })
  }
}

const dateParser = (date) => {
  if (!date) return

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

export const SuppliersStore = new Module({
  namespaced,
  state: SuppliersState,
  getters: SuppliersGetters,
  mutations: SuppliersMutations,
  actions: SuppliersActions
})

export const suppliersMapper = createMapper(SuppliersStore)
