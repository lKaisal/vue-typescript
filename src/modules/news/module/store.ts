import { AxiosResponse } from 'axios'
import axios from '@/services/axios'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
import { News, ListSort, TextForPublish, PublishPayload, TableField } from '../models'

const namespaced = true
const isDev = process && process.env && process.env.NODE_ENV === 'development'

class NewsState {
  currentNews: { data: News, isLoading: boolean, error: string } = { data: null, isLoading: null, error: null }
  list: { data: News[], isLoading: boolean, error: string } = { data: null, isLoading: null, error: null }
  listSort: ListSort = { by: 'created_at', direction: 'desc' }
  textsForEdit: TextForPublish[] = null // мутируемые тексты по всем изменения инпутов и редакторов
  textsForPublish: TextForPublish[] = null // тексты для экшена публикации, мутируются только после подтверждения на странице
  publish: { isLoading: boolean, error: string } = { isLoading: false, error: null }
  delete: { isLoading: boolean, error: string } = { isLoading: false, error: null }
}

class NewsGetters extends Getters<NewsState> {
  get isLoading() { return this.state.list.isLoading || this.state.currentNews.isLoading || this.state.publish.isLoading || this.state.delete.isLoading }
  get loadingError() { return this.state.list.error || this.state.currentNews.error || this.state.publish.error || this.state.delete.error }
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
  get newsById() {
    return (id: News['id']) => this.state.list.data.find(s => s.id === id)
  }
  get publishPayload(): PublishPayload {
    const fields = this.state.textsForPublish
    const currentNews = this.state.currentNews.data
    // const header = (currentNews['headerMobile'] || currentNews['header'] !== fields.find(f => f.field === 'headerMobile').value) ? fields.find(f => f.field === 'headerMobile').value : null
    // const preview = fields.find(f => f.field === 'previewMobile').value
    // const body = fields.find(f => f.field === 'bodyMobile').value
    const header = this.getters.publishPayloadField('header')
    const preview = this.getters.publishPayloadField('preview')
    const body = this.getters.publishPayloadField('body')
    const payload: PublishPayload = Object.assign({})
    payload.approve = true
    if (header) payload.header = header
    if (preview) payload.preview = preview
    if (body) payload.body = body

    return payload
  }
  get publishPayloadField() {
    return (field: keyof News) => {
      const fields = this.state.textsForPublish
      const currentNews = this.state.currentNews.data

      if (!currentNews || !fields) return

      const fieldMobile = `${field}Mobile`
      const currentValue = currentNews[field]
      const currentValueMobile = currentNews[fieldMobile]
      const publishValue = fields.find(f => f.field === fieldMobile).value

      const valueChanged = (currentValueMobile && currentValueMobile !== publishValue) || (!currentValueMobile && currentValue !== publishValue)

      return valueChanged ? publishValue : null
    }
  }
  get fieldsNeedToBePublished() {
    const header = this.getters.publishPayloadField('header')
    const preview = this.getters.publishPayloadField('preview')
    const body = this.getters.publishPayloadField('body')

    return !!header || !!preview || !!body
  }
}

class NewsMutations extends Mutations<NewsState> {
  updateListSort(payload: ListSort) {
    this.state.listSort.by = payload.by
    this.state.listSort.direction = payload.direction
  }
  // LIST LOADING
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
  // ADDITIONA DATA LOADING
  startCurrentNewsLoading() {
    this.state.currentNews.isLoading = true
    this.state.currentNews.error = null
  }
  setCurrentNewsLoadingSuccess(payload: News) {
    this.state.currentNews.data = payload
    this.state.currentNews.isLoading = false
    this.state.currentNews.error = null
  }
  setCurrentNewsLoadingFail(err) {
    this.state.currentNews.data = null
    this.state.currentNews.isLoading = false
    this.state.currentNews.error = err
  }
  clearCurrentNews() {
    this.state.currentNews.data = null
    this.state.currentNews.isLoading = false
    this.state.currentNews.error = null
  }
  // TEXTS PUBLISHED AND EDITED MUTATIONS
  setTextsForPublish(payload: TextForPublish[]) {
    this.state.textsForPublish = payload
  }
  updateTextForPublish(payload: {field: TextForPublish['field'], value: TextForPublish['value']}) {
    const texts = this.state.textsForPublish
    const field = texts.find(f => f.field === payload.field)
    field.value = payload.value
  }
  setTextsForEdit(payload: TextForPublish[]) {
    this.state.textsForEdit = payload
  }
  updateTextForEdit(payload: {field: TextForPublish['field'], value: TextForPublish['value']}) {
    const texts = this.state.textsForEdit
    const field = texts.find(f => f.field === payload.field)
    field.value = payload.value
  }
  resetTextsForEdit() {
    this.state.textsForEdit = this.state.textsForPublish
  }
  // PUBLISJ MUTATIONS
  startPublish() {
    this.state.publish.isLoading = true
    this.state.publish.error = null
  }
  setPublishSuccess() {
    this.state.publish.isLoading = false
    this.state.publish.error = null
  }
  setPublishFail(err) {
    this.state.publish.isLoading = false
    this.state.publish.error = err
  }
  // DELETE MUTATIONS
  startDelete() {
    this.state.publish.isLoading = true
    this.state.publish.error = null
  }
  setDeleteSuccess() {
    this.state.publish.isLoading = false
    this.state.publish.error = null
  }
  setDeleteFail(err) {
    this.state.publish.isLoading = false
    this.state.publish.error = err
  }
}

class NewsActions extends Actions<NewsState, NewsGetters, NewsMutations, NewsActions> {
  async getList(forceUpdate?: boolean) {
    return new Promise(async (resolve, reject) => {
      this.commit('startListLoading', null)

      if (forceUpdate) await axios.get('/api/v1/news-migrate') // принудительное обновление списка новостей с портала (автоматически раз в 30сек) 

      axios.get('/api/v1/news-list')
        .then((res: AxiosResponse<any>) => {
          while (!Array.isArray(res)) res = res.data

          this.commit('setListLoadingSuccess', res)
          if (isDev) console.log('Success: load news list')
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
  async getCurrentNews(payload: {id: News['id'], forceUpdate?: boolean}) {
    return new Promise(async (resolve, reject) => {
      this.commit('startCurrentNewsLoading')

      if (payload.forceUpdate) await axios.get('/api/v1/news-migrate') // принудительное обновление списка новостей с портала (автоматически раз в 30сек) 

      axios.get(`/api/v1/news-detail/${payload.id}`)
        .then((res: AxiosResponse<any>) => {
          // while (!Array.isArray(res)) res = res.data
          const data = res.data

          this.commit('setCurrentNewsLoadingSuccess', data)
          if (isDev) console.log('Success: load current news, id: ' + payload.id)
          resolve()
        })
        .catch(error => {
          if (isDev && error && error.response) console.log(error.response)
          else console.log('error')

          const errMsg = error && error.response && error.response.data && error.response.data.message || null
          this.commit('setCurrentNewsLoadingFail', errMsg)
          if (error && error.response) reject(error.response)
          else reject()
        })
    })
  }
  async publishNews(id: News['id']) {
    return new Promise(async (resolve, reject) => {
      this.commit('startPublish')
      const payload = this.getters.publishPayload

      axios.post(`/api/v1/news-update/${id}`, payload)
        .then((res: AxiosResponse<any>) => {
          const data = res.data

          this.commit('setPublishSuccess', data)
          if (isDev) console.log('Success: publish news, id: ' + id)
          resolve()
        })
        .catch(error => {
          if (isDev && error && error.response) console.log(error.response)
          else console.log('error')

          const errMsg = error && error.response && error.response.data && error.response.data.message || null
          this.commit('setPublishFail', errMsg)
          if (error && error.response) reject(error.response)
          else reject()
        })
    })
  }
  async deleteNews(id: News['id']) {
    return new Promise(async (resolve, reject) => {
      this.commit('startDelete')

      axios.delete(`/api/v1/news-delete/${id}`)
        .then((res: AxiosResponse<any>) => {
          const data = res.data

          this.commit('setDeleteSuccess', data)
          if (isDev) console.log('Success: delete news, id: ' + id)
          resolve()
        })
        .catch(error => {
          if (isDev && error && error.response) console.log(error.response)
          else console.log('error')

          const errMsg = error && error.response && error.response.data && error.response.data.message || null
          this.commit('setDeleteFail', errMsg)
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
