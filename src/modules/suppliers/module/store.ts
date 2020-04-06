import { AxiosResponse, AxiosError } from 'axios'
import { Supplier, ListSort, EditPayload, Country, EditResponse, SmsFields, FilterItem } from '../models'
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
  // LIST STATE
  list: { data: Supplier[], error: string, isLoading: boolean } =  { data: null, error: null, isLoading: false }
  listFiltered: Supplier[] = null
  listSort: ListSort = { by: 'createdAt', direction: 'desc' }
  // PHONE & IDENTITY STATE
  edit: { error: string, isLoading: boolean } = { error: null, isLoading: false }
  identity: { data: SmsFields, error: string, isLoading: boolean} = {
    data: null,
    error: null,
    isLoading: false
  }
  smsReset: { error: string, isLoading: boolean, field: keyof SmsFields } = { error: null, isLoading: false, field: null }
  phoneAuthDelete: { error: string, isLoading: boolean } = { error: null, isLoading: false }
  // FILTER STATE
  filter: FilterItem[] = []
}

class SuppliersGetters extends Getters<SuppliersState> {
  get isLoading() { return this.state.list.isLoading || this.state.edit.isLoading || this.state.identity.isLoading || this.state.smsReset.isLoading ||
    this.state.phoneAuthDelete.isLoading }
  get loadingError() { return this.state.list.error || this.state.edit.error || this.state.identity.error || this.state.smsReset.error ||
    this.state.phoneAuthDelete.error }
  get supplierByUserId() {
    return (userId: Supplier['userId']) => this.state.list.data.find(s => s.userId === userId)
  }
  get listSorted() {
    if (!this.state.list.data || !this.state.list.data.length) return

    const list = this.state.listFiltered ? [...this.state.listFiltered] : [...this.state.list.data]

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
  get listSortedAndFiltered() {
    const list = this.getters.listSorted

    if (!list) return

    const filters = this.state.filter

    const res = list.filter(supplier => {
      return filters.every(filter => {
        if (!filter.valuesSelected.length) return true
        else {
          const field = filter.field
          const supplierField = supplier[field]
          return filter.valuesSelected.includes(supplierField)
        }
      })
    })

    return res
  }
  get uniqueFields() {
    return (field: keyof Supplier) => {
      const set: Set<Supplier[keyof Supplier]> = new Set()
      for (const el of this.getters.listSorted) {
        set.add(el[field])
      }

      const res = Array.from(set).sort((a, b) => {
        if (typeof a === 'boolean') {
          if (a === true) return -1
          else if (a === false) return 1
          else return 0
        }
        else {
          if (a > b) return 1
          else if (a < b) return -1
          else return 0
        }
      })
  
      return res
    }
  }
}

class SuppliersMutations extends Mutations<SuppliersState> {
  // List sort, filter
  updateListSort(payload: ListSort) {
    this.state.listSort.by = payload.by
    this.state.listSort.direction = payload.direction
  }
  setListSearched(payload) {
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
    console.log('set list loading success ' + new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds())
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
  // Mutations SmsTryCount reset
  startSmsReset(payload: keyof SmsFields) {
    this.state.smsReset.field = payload
    this.state.smsReset.isLoading = true
    this.state.smsReset.error = null
  }
  setSmsResetSuccess() {
    this.state.smsReset.isLoading = false
    this.state.smsReset.error = null
  }
  setSmsResetFail(err) {
    this.state.smsReset.isLoading = false
    this.state.smsReset.error = err
  }
  // Mutations PhoneAuth Delete
  startPhoneAuthDelete() {
    this.state.phoneAuthDelete.isLoading = true
    this.state.phoneAuthDelete.error = null
  }
  setPhoneAuthDeleteSuccess() {
    this.state.phoneAuthDelete.isLoading = false
    this.state.phoneAuthDelete.error = null
  }
  setPhoneAuthDeleteFail(err) {
    this.state.phoneAuthDelete.isLoading = false
    this.state.phoneAuthDelete.error = err
  }
  // Mutations Update list partial data
  updateSupplier(payload: EditResponse) {
    const supplier = this.state.list.data.find(s => s.userId === payload.userId)
    supplier.phone = payload.phone
    supplier.phoneAuthId = payload.phoneAuthId
  }
  updateIdentity(payload: SmsFields) {
    const keys = Object.keys(payload)
    keys.forEach(key => this.state.identity.data[key] = payload[key])
  }
  // Mutations Filter
  addFilterFields(filters: FilterItem[]) {
    this.state.filter = []
    for (const filter of filters) {
      this.state.filter.push(filter)
    }
  }
  addFilterSelected(payload: {field: FilterItem['field'], values: FilterItem['valuesSelected']}) {
    const filterField = this.state.filter.find(f => f.field === payload.field)
    filterField.valuesSelected = payload.values
  }
}

class SuppliersActions extends Actions<SuppliersState, SuppliersGetters, SuppliersMutations, SuppliersActions> {
  // LIST ACTIONS
  async getList() {
    return new Promise((resolve, reject) => {
      this.commit('startListLoading')

      // axios.get('/api/v1/suppliers-list')
      //   .then((res: AxiosResponse<any>) => {
      //     while (!Array.isArray(res)) res = res.data
          const res: Supplier[] = [
            { confirmed: true, contractType: 'Тип 1', createdAt: '22-03-2020 10:09', email: 'email@mail.com', inn: '11100001110', phone: '79159998877', phoneAuthId: 1234, supplierId: 1234, supplierName: '1234', userId: 1234, userName: 'username' },
            { confirmed: true, contractType: 'Тип 2', createdAt: '22-02-2020 10:09', email: 'email@mail.com', inn: '11100001111', phone: '79159998877', phoneAuthId: 1234, supplierId: 1234, supplierName: '1234', userId: 1234, userName: 'username' },
            { confirmed: true, contractType: 'Тип 3', createdAt: '18-03-2020 10:09', email: 'email@mail.com', inn: '11100001112', phone: '79159998877', phoneAuthId: 1234, supplierId: 1234, supplierName: '1234', userId: 1234, userName: 'username' },
            { confirmed: false, contractType: 'Тип 4', createdAt: '01-03-2020 10:09', email: 'email@mail.com', inn: '11100001113', phone: '79159998877', phoneAuthId: 1234, supplierId: 1234, supplierName: '1234', userId: 1234, userName: 'username' },
            { confirmed: true, contractType: 'Тип 5', createdAt: '22-01-2020 10:09', email: 'email@mail.com', inn: '11100001114', phone: '79159998877', phoneAuthId: 1234, supplierId: 1234, supplierName: '1234', userId: 1234, userName: 'username' },
            { confirmed: true, contractType: 'Тип 1', createdAt: '22-02-2020 10:09', email: 'email@mail.com', inn: '11100001115', phone: '79159998877', phoneAuthId: 1234, supplierId: 1234, supplierName: '1234', userId: 1234, userName: 'username' },
            { confirmed: true, contractType: 'Тип 2', createdAt: '25-03-2020 10:09', email: 'email@mail.com', inn: '11100001116', phone: '79159998877', phoneAuthId: 1234, supplierId: 1234, supplierName: '1234', userId: 1234, userName: 'username' },
            { confirmed: false, contractType: 'Тип 3', createdAt: '01-04-2020 10:09', email: 'email@mail.com', inn: '11100001117', phone: '79159998877', phoneAuthId: 1234, supplierId: 1234, supplierName: '1234', userId: 1234, userName: 'username' },
            { confirmed: true, contractType: 'Тип 4', createdAt: '21-03-2020 10:09', email: 'email@mail.com', inn: '11100001118', phone: '79159998877', phoneAuthId: 1234, supplierId: 1234, supplierName: '1234', userId: 1234, userName: 'username' },
          ]

          this.commit('setListLoadingSuccess', res)
          if (isDev) console.log('Success: load list')
          console.log('list load resolve ' + res.length + ' ' + new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds())
          resolve()
        // })
        // .catch(error => {
        //   if (isDev && error && error.response) console.log(error.response)
        //   else console.log('error')

        //   const errMsg = error && error.response && error.response.data && error.response.data.message || null
        //   this.commit('setListLoadingFail', errMsg)
        //   if (error && error.response) reject(error.response)
        //   else reject()
        // })
    })
  }
  // PHONE & IDENTITY ACTIONS
  async getIdentity(userId: Supplier['userId']) {
    return new Promise(async (resolve, reject) => {
      this.commit('startIdentityLoading')

      axios.get(`/api/v1/sms-info/${userId}`)
        .then((res: AxiosResponse<any>) => {
          // while (!Array.isArray(res)) res = res.data
          const data: SmsFields = res.data

          this.commit('setIdentityLoadingSuccess', data)
          if (isDev) console.log('Success: load list')
          resolve()
        })
        .catch(error => {
          if (isDev && error && error.response) console.log(error.response)
          else console.log('error')

          const errMsg = error && error.response && error.response.data && error.response.data.message || null
          this.commit('setIdentityLoadingFail', errMsg)
          if (error && error.response) reject(error.response)
          else reject()
        })
    })
  }
  async resetSmsCount(payload: {userId: Supplier['userId'], field: keyof SmsFields}) {
    let api = null
    if (payload.field === 'smsSendCount') api = `/api/v1/sms-list/${payload.userId}`
    else if (payload.field === 'smsTryCount') api = `/api/v1/sms-attempts/${payload.userId}`
    else return

    return new Promise(async (resolve, reject) => {
      this.commit('startSmsReset')

      axios.delete(api)
        .then((res: AxiosResponse<any>) => {
          const data: SmsFields = res.data

          this.commit('updateIdentity', data)
          this.commit('setSmsResetSuccess')
          if (isDev) console.log('Success: ' + payload.field + ' reset, userId: ' + payload.userId)
          resolve()
        })
        .catch(error => {
          if (isDev && error && error.response) console.log(error.response)
          else console.log('error')

          const errMsg = error && error.response && error.response.data && error.response.data.message || null
          this.commit('setSmsResetFail', errMsg)
          if (error && error.response) reject(error.response)
          else reject()
        })
    })
  }
  editPhone(payload: EditPayload) {
    return new Promise((resolve, reject) => {
      this.commit('startEdit')

      axios.post('/api/v1/phone', payload)
        .then((res) => {
          const data: EditResponse = res.data
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
  deletePhoneAuth(userId: SmsFields['userId']) {
    return new Promise((resolve, reject) => {
      this.commit('startPhoneAuthDelete')

      axios.delete(`/api/v1/phone-auth/${userId}`)
        .then((res) => {
          if (isDev) console.log('Success: delete phoneAuth, userId: ' + userId)
          this.commit('setPhoneAuthDeleteSuccess')
          resolve()
        })
        .catch(error => {
          if (isDev && error && error.response) console.log(error.response)
          else console.log('error')

          const errMsg = error && error.response && error.response.data && error.response.data.message || null
          this.commit('setPhoneAuthDeleteFail', errMsg)
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
