import { AxiosResponse } from 'axios'
import axios from '@/services/axios'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
import { News, ListSort } from '../models'

const namespaced = true
const isDev = process && process.env && process.env.NODE_ENV === 'development'

class NewsState {
  list: { data: News[], isLoading: boolean, error: string } = { data: null, isLoading: null, error: null }
  listSort: ListSort = { by: 'created_at', direction: 'desc' }
}

class NewsGetters extends Getters<NewsState> {
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
        case 'header':
        case 'headerMobile':
          sortA = sortA.toString().trim().toLowerCase()
          sortB = sortB.toString().trim().toLowerCase()
          break

        case 'id':
          sortA = Number(sortA)
          sortB = Number(sortB)
          break

        case 'created_at':
        case 'updated_at':
          sortA = dateParser(sortA)
          sortB = dateParser(sortB)
          break
      }

      if ((sortA > sortB && sortDirection === 'asc') || (sortA < sortB && sortDirection === 'desc')) return 1
      else return -1
    })
  }
}

class NewsMutations extends Mutations<NewsState> {
  updateListSort(payload: ListSort) {
    this.state.listSort.by = payload.by
    this.state.listSort.direction = payload.direction
  }
  // BANNERS LIST LOADING
  startListLoading() {
    this.state.list.isLoading = true
    this.state.list.error = null
  }
  setListLoadingSuccess(payload: News[]) {
    this.state.list.data = payload
    this.state.list.error = null
    this.state.list.isLoading = false
  }
  setListLoadingFail(err) {
    this.state.list.data = null
    this.state.list.error = err
    this.state.list.isLoading = false
  }
}

class NewsActions extends Actions<NewsState, NewsGetters, NewsMutations, NewsActions> {
  async getList() {
    return new Promise((resolve, reject) => {
      this.commit('startListLoading', null)

      axios.get('/api/v1/news-list')
        .then((res: AxiosResponse<any>) => {
          while (!Array.isArray(res)) res = res.data

          this.commit('setListLoadingSuccess', res)
          if (isDev) console.log('Success: load list')
          resolve()
        })
        .catch(error => {
          const errMsg = error && error.response && error.response.data && error.response.data.message || null
          this.commit('setListLoadingFail', errMsg)
          if (error && error.response) reject(error.response)
          else reject()
        })
    })
  }
}

const dateParser = (date) => {
  const dateParser = /(\d{2})\-(\d{2})\-(\d{4}) (\d{2}):(\d{2})/;
  const match = date.match(dateParser);
  const year = Number(match[3]) // year
  const monthIndex = Number(match[2])-1 // monthIndex
  const day = Number(match[1]) // day
  const hours = Number(match[4]) // hours
  const minutes = Number(match[5]) // minutes
  const newDate = new Date(year, monthIndex, day, hours, minutes)

  return Date.parse(newDate.toString())
}

const getDateTime = (date: string) => {
  const dateSplit = date.split('-')

  const dateDate = new Date()
  dateDate.setDate(Number(dateSplit[0]))
  dateDate.setMonth(Number(dateSplit[1]))
  dateDate.setFullYear(Number(dateSplit[2]))
  dateDate.setHours(0,0,0,0)

  const dateTime = dateDate.getTime()

  return dateTime
}

export const NewsStore = new Module({
  namespaced,
  state: NewsState,
  getters: NewsGetters,
  mutations: NewsMutations,
  actions: NewsActions
})

export const newsMapper = createMapper(NewsStore)
