import { AxiosResponse, AxiosError } from 'axios'
import { Section, ListSort, EditPayload } from '../models'
import service from '@/client/index'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'

const namespaced = true

class FeaturesState {
  edit: { error: string, isLoading: boolean } = { error: null, isLoading: false }
  hashes: ['active', 'inactive'] = ['active', 'inactive']
  list: { data: Section[], error: string, isLoading: boolean } =  { data: null, error: null, isLoading: false }
  listSort: ListSort = { by: 'id', direction: 'asc' }
  // list: { data: Section[], error: string, isLoading: boolean } =  { data: [{active: true, createdAt: '20-02-2020', description: 'description', feature: 'Feature', id: 1, name: 'Name', updatedAt: '20-02-2020', username: 'Username'}], error: null, isLoading: false }
}

class FeaturesGetters extends Getters<FeaturesState> {
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
        case 'feature':
          sortA = sortA.toString().charAt(0).toUpperCase() + sortA.toString().slice(1)
          sortB = sortB.toString().charAt(0).toUpperCase() + sortB.toString().slice(1)
          break

        case 'updatedAt':
        case 'createdAt':
          sortA = getDateTime(sortA.toString())
          sortB = getDateTime(sortB.toString())
          break
      }

      if ((sortA > sortB && sortDirection === 'asc') || (sortA < sortB && sortDirection === 'desc')) return 1
      else return -1
    })
  }
  get listActive() { return this.getters.listSorted && this.getters.listSorted.filter(b => b.active) }
  get listInactive() { return this.getters.listSorted && this.getters.listSorted.filter(b => !b.active) }
}

class FeaturesMutations extends Mutations<FeaturesState> {
  updateListSort(payload: ListSort) {
    this.state.listSort.by = payload.by
    this.state.listSort.direction = payload.direction
  }
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

class FeaturesActions extends Actions<FeaturesState, FeaturesGetters, FeaturesMutations, FeaturesActions> {
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

      service.post('/api/v1/features', payload)
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

const getDateTime = (date: string) => {
  let dateSplit = date.split(/-| |:/)
  
  const dateDate = new Date()
  dateDate.setDate(Number(dateSplit[0]))
  dateDate.setMonth(Number(dateSplit[1]) - 1)
  dateDate.setFullYear(Number(dateSplit[2]))
  dateDate.setHours(Number(dateSplit[3]), Number(dateSplit[4]), 0, 0)

  const dateTime = dateDate.getTime()

  return dateTime
}

export const features = new Module({
  namespaced,
  state: FeaturesState,
  getters: FeaturesGetters,
  mutations: FeaturesMutations,
  actions: FeaturesActions
})

export const featuresMapper = createMapper(features)
