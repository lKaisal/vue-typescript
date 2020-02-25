import { AxiosResponse, AxiosError } from 'axios'
import { Section, ListSort } from '../models'
import service from '@/client/index'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'

const namespaced = true

class SectionsState {
  list: { data: Section[], error: string, isLoading: boolean } =  { data: null, error: null, isLoading: false }
  listSort: ListSort = { by: 'id', direction: 'asc' }
  listSorted: Section[] = null
  // list: { data: Section[], error: string, isLoading: boolean } =  { data: [{active: true, createdAt: '20-02-2020', description: 'description', feature: 'Feature', id: 1, name: 'Name', updatedAt: '20-02-2020', username: 'Username'}], error: null, isLoading: false }
}

class SectionsGetters extends Getters<SectionsState> {
  get isLoading() { return this.state.list.isLoading }
  get loadingError() { return this.state.list.error }
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
  get listToEdit() { return null }
}

class SectionsMutations extends Mutations<SectionsState> {
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

export const sections = new Module({
  namespaced,
  state: SectionsState,
  getters: SectionsGetters,
  mutations: SectionsMutations,
  actions: SectionsActions
})

export const sectionsMapper = createMapper(sections)
