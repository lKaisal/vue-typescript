import { AxiosResponse, AxiosError } from 'axios'
import { Banner, FormField, BannerForm, Form, FormType, BannerCurrent, BannerFormData } from '../models'
import axios from '@/services/axios'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'

const namespaced = true
const isDev = process && process.env && process.env.NODE_ENV === 'development'

class BannersState {
  activeAmount: { value: number, error: string, isLoading: boolean } = { value: null, error: null, isLoading: false }
  /** Currently edited banner (for pageEdit) */
  bannerCurrent: BannerCurrent = {
    data: null,
    error: null,
    isLoading: false
  }
  form: Form = {
    data: [
      { name: 'activeFrom', value: null, validationRequired: false, isValid: false, errorType: null, errorMsg: null },
      { name: 'activeTo', value: null, validationRequired: false, isValid: false, errorType: null, errorMsg: null },
      { name: 'appLink', value: null, validationRequired: false, isValid: false, errorType: null, errorMsg: null },
      { name: 'isActive', value: true, validationRequired: false, isValid: true, errorType: null, errorMsg: null },
      { name: 'file', value: null, validationRequired: true, isValid: false, errorType: null, errorMsg: null },
      { name: 'newsId', value: null, validationRequired: true, isValid: false, errorType: null, errorMsg: null },
      { name: 'pageType', value: null, validationRequired: false, isValid: false, errorType: null, errorMsg: null },
      { name: 'sort', value: null, validationRequired: false, isValid: false, errorType: null, errorMsg: null },
      { name: 'title', value: null, validationRequired: true, isValid: false, errorType: null, errorMsg: null }
    ],
    error: null,
    errors: [
      { type: 'default', msg: 'Недопустимое значение' },
      { type: 'empty', msg: 'Поле не должно быть пустым' },
      { type: 'emptyActiveFrom', msg: 'Укажите дату начала или удалите дату окончания' },
      { type: 'emptyActiveTo', msg: 'Укажите дату окончания или удалите дату начала' },
      { type: 'imgExtension', msg: 'Загрузите изображение в формате .jpg или .png' }
    ],
    isLoading: false,
    type: null,
    validationIsShown: false,
  }
  hashes: ['active', 'delayed', 'archive'] = ['active', 'delayed', 'archive']
  imgExtensions: string[] = [ 'jpg', 'jpeg', 'png' ]
  isLoading: boolean = false // deleteBanner, deactivateBanner
  loadingError: string = null
  list: { data: Banner[], error: string, isLoading: boolean } = { data: null, error: null, isLoading: false }
  pageTypes: string[] = ['news']
}

class BannersGetters extends Getters<BannersState> {
  get isLoading() { return this.state.isLoading || this.state.activeAmount.isLoading || this.state.bannerCurrent.isLoading || this.state.form.isLoading || this.state.list.isLoading }
  get loadingError() { return this.state.loadingError || this.state.activeAmount.error || this.state.bannerCurrent.error || this.state.form.error || this.state.list.error }
  // LIST GETTERS
  get listMastered() {
    if (!this.state.list.data) return

    const arr = [...this.state.list.data]
    arr.forEach(item => {
      item.activeFromTime = getDateTime(item.activeFrom) || null
      item.activeToTime = getDateTime(item.activeTo) || null
    })

    return arr
  }
  get listActive() {
    if (!this.getters.listMastered) return

    const arr = this.getters.listMastered.filter(item => item.isActive).sort((a, b) => {
      const sortA = a.position
      const sortB = b.position

      if (sortA > sortB) return 1
      else if (sortA < sortB) return -1
      else return 0
    })

    return arr
  }
  get listDelayed() {
    if (!this.getters.listMastered) return

    const arr = this.getters.listMastered.filter(item => !item.isActive && item.delayStart).sort((a, b) => {
      const sortA = a.activeFromTime
      const sortB = b.activeFromTime

      if (sortA > sortB) return 1
      else if (sortA < sortB) return -1
      else return 0
    })

    return arr
  }
  get listInactive() {
    if (!this.getters.listMastered) return

    const arr = this.getters.listMastered.filter(item => !item.isActive && !item.delayStart).sort((a, b) => {
      const updatedAtA = dateParser(a.updatedAt)
      const updatedAtB = dateParser(b.updatedAt)

      if (updatedAtA < updatedAtB) return 1
      else if (updatedAtA > updatedAtB) return -1
      else return 0
    })

    return arr
  }
  // SINGLE BANNER GETTERS
  get bannerById() {
    return (id: Banner['id']) => { return this.state.list.data && this.state.list.data.find(b => b.id.toString() === id.toString()) }
  }
  get bannerCurrentStatus() {
    const banner = this.state.bannerCurrent.data

    if (!banner) return this.state.hashes[0]

    if (banner.isActive) return this.state.hashes[0]
    else if (banner.delayStart) return this.state.hashes[1]
    else return this.state.hashes[2]
  }
  // FORM GETTERS
  get formActiveFrom() { return this.state.form.data.find(field => field.name === 'activeFrom') }
  get formActiveTo() { return this.state.form.data.find(field => field.name === 'activeTo') }
  get formAppLink() { return this.state.form.data.find(field => field.name === 'appLink') }
  get formIsActive() { return this.state.form.data.find(field => field.name === 'isActive') }
  get formFile() { return this.state.form.data.find(field => field.name === 'file') }
  get formNewsId() { return this.state.form.data.find(field => field.name === 'newsId') }
  get formPageType() { return this.state.form.data.find(field => field.name === 'pageType') }
  get formSort() { return this.state.form.data.find(field => field.name === 'sort') }
  get formTitle() { return this.state.form.data.find(field => field.name === 'title') }
  get formIsValid () {
    const required = this.state.form.data.filter(field => field.validationRequired)

    return required.every(field => field.isValid)
  }
  get formData() {
    const formData: BannerFormData = Object.assign({})

    formData.activeFrom = this.getters.formActiveFrom.value && this.getters.formActiveFrom.value.toString() || ''
    formData.activeTo = this.getters.formActiveTo.value && this.getters.formActiveTo.value.toString() || ''
    formData.appLink = this.getters.formAppLink.value && this.getters.formAppLink.value.toString() || ''
    formData.isActive = this.getters.formIsActive.value && this.getters.formIsActive.value.toString() || (this.getters.bannerCurrentStatus === 'delayed').toString()
    formData.newsId = this.getters.formNewsId.value && this.getters.formNewsId.value.toString() || ''
    formData.pageType = this.getters.formPageType.value && this.getters.formPageType.value.toString() || ''
    formData.sort = (this.getters.formIsActive.value || this.state.bannerCurrent.data.delayStart) && this.getters.formSort.value && this.getters.formSort.value.toString() || this.state.activeAmount.value && (this.state.activeAmount.value).toString()
    formData.title = this.getters.formTitle.value && this.getters.formTitle.value.toString() || ''

    // @ts-ignore
    if (this.getters.formFile.value && this.getters.formFile.value.type) formData.file = this.getters.formFile.value
    else formData.file = null

    return formData
  }
  get preparedFormData() {
    try {
      const formData = new FormData()
  
      Object.keys(this.getters.formData).forEach(key => {
        const value = this.getters.formData[key]
        if (!!value || this.state.form.type === 'create') formData.append(key, value)
      })
  
      return formData
    } catch(err) {
      if (isDev) console.log(err)
      else console.log('error')
    }
  }
}

class BannersMutations extends Mutations<BannersState> {
  startLoading() {
    this.state.isLoading = true
    this.state.loadingError = null
  }
  setLoadingSuccess() {
    this.state.isLoading = false
    this.state.loadingError = null
  }
  setLoadingFail(err) {
    this.state.isLoading = false
    this.state.loadingError = err
  }
  // BANNERS LIST
  startListLoading() {
    this.state.list.isLoading = true
    this.state.list.error = null
  }
  setListLoadingSuccess(payload: Banner[]) {
    this.state.list.data = payload
    this.state.list.error = null
    this.state.list.isLoading = false
  }
  setListLoadingFail(err) {
    this.state.list.data = null
    this.state.list.error = err
    this.state.list.isLoading = false
  }
  // BANNER CURRENT
  startBannerCurrentLoading() {
    this.state.bannerCurrent.isLoading = true
    this.state.bannerCurrent.error = null
  }
  setBannerCurrentSuccess(payload: Banner) {
    this.state.bannerCurrent.data = payload
    this.state.bannerCurrent.error = null
    this.state.bannerCurrent.isLoading = false
  }
  setBannerCurrentFail(err) {
    this.state.bannerCurrent.data = null
    this.state.bannerCurrent.error = err
    this.state.bannerCurrent.isLoading = false
  }
  // ACTIVE AMOUNT
  startActiveAmountLoading() {
    this.state.activeAmount.isLoading = true
    this.state.activeAmount.error = null
  }
  setActiveAmountSuccess(payload: number) {
    this.state.activeAmount.value = payload
    this.state.activeAmount.error = null
    this.state.activeAmount.isLoading = false
  }
  setActiveAmountFail(err) {
    this.state.activeAmount.value = null
    this.state.activeAmount.error = err
    this.state.activeAmount.isLoading = false
  }
  // FORM MUTATIONS
  setFormIsLoading(payload: boolean) { this.state.form.isLoading = payload }
  setFormType(payload: FormType) { this.state.form.type = payload }
  setValidationIsShown(payload: boolean) { this.state.form.validationIsShown = payload }
  clearForm() {
    const fields = this.state.form.data

    fields.forEach(field => {
      field.value = field.name === 'isActive' || (field.name === 'sort' ? this.state.activeAmount.value : (field.name === 'pageType' ? this.state.pageTypes[0] : null))
      field.isValid = field.name === 'sort' || field.name === 'pageType'
      field.validationRequired = field.name === 'file' || field.name === 'newsId' || field.name === 'title'
      field.errorType = !field.value && field.validationRequired && 'empty' || 'default'
      field.errorMsg = field.errorType && this.state.form.errors.find(f => f.type === field.errorType).msg
    })

    this.state.form.validationIsShown = false
  }
  handleFormErrors(errors) {
    const names = Object.keys(errors)
    if (names && names.length) {
      for (const name of names) {
        const field = this.state.form.data.find(f => f.name === name)
        field.errorMsg = errors[name]
        field.isValid = false
      }
    }
  }
  // FORM FIELDS MUTATIONS
  setField(payload: {field: FormField, prop: keyof FormField, value: any}) {
    // @ts-ignore
    payload.field[payload.prop] = payload.value
  }
  // PAGETYPES
  addPageType(payload: Banner['pageType']) {
    this.state.pageTypes.push(payload)
    this.state.pageTypes.sort()
  }
  setPageTypesList(payload: {pageType: Banner['pageType']}[]) {
    const dataMastered = payload.map(el => el.pageType).sort()
    this.state.pageTypes = dataMastered
  }
}

class BannersActions extends Actions<BannersState, BannersGetters, BannersMutations, BannersActions> {
  async loadGlobalData() {
    return new Promise((resolve, reject) => {
      const promisesArr = [this.dispatch('getList', null), this.dispatch('getActiveAmount', null), this.dispatch('getPageTypesList', null)]
      Promise.all(promisesArr)
        .then(() => resolve())
        .catch((err) => reject(err))
    })
  }
  async getList() {
    return new Promise((resolve, reject) => {
      this.commit('startListLoading')

      axios.get('/api/v1/banners-list')
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
  async createBanner() {
    return new Promise((resolve, reject) => {
      const formIsValid = this.getters.formIsValid

      if (!formIsValid) {
        this.commit('setValidationIsShown', true)
        reject()
        return
      }

      this.commit('setFormIsLoading', true)
      const data = this.getters.preparedFormData

      axios.post('/api/v1/banner', data)
        .then((res: AxiosResponse<Banner>) => {
          this.commit('setValidationIsShown', false)
          this.commit('setBannerCurrentSuccess', res.data)
          this.dispatch('updateFormByBannerData', (res.data))
          if (isDev) console.log('Success: create banner id=' + res.data.id)
          resolve()
        })
        .catch((error: AxiosError<any>) => {
          if (error && error.response) {
            if (isDev && error && error.response) console.log(error.response)
            else console.log('error')
            this.commit('setValidationIsShown', true)
            if (!!error.response.data && error.response.data.errors) {
              const errors = error.response.data.errors
              if (errors.bannerId) reject({ bannerId: errors.bannerId })
              else {
                this.commit('handleFormErrors', errors)
                reject()
              }
            }
          } else reject()
        })
        .finally(() => {
          this.commit('setFormIsLoading', false)
        })
    })
  }
  /** Edit existing banner */
  editBanner(id: Banner['id']) {
    return new Promise((resolve, reject) => {
      const formIsValid = this.getters.formIsValid

      if (!formIsValid) {
        this.commit('setValidationIsShown', true)
        reject()
        return
      }

      this.commit('setFormIsLoading', true)
      const data = this.getters.preparedFormData

      axios.put(`/api/v1/banner/${id}`, data)
        .then((res: AxiosResponse<Banner>) => {
          this.commit('setValidationIsShown', false)
          this.commit('setBannerCurrentSuccess', res.data)
          this.dispatch('updateFormByBannerData', (res.data))
          if (isDev) console.log('Success: edit banner id=' + res.data.id)
          resolve()
        })
        .catch((error: AxiosError<any>) => {
          if (error && error.response) {
            if (isDev && error && error.response) console.log(error.response)
            else console.log('error')

            this.commit('setValidationIsShown', true)
            if (!!error.response.data && error.response.data.errors) {
              const errors = error.response.data.errors
              if (errors.bannerId) reject({ bannerId: errors.bannerId })
              else {
                this.commit('handleFormErrors', error.response.data.errors)
                if (error && error.response) reject(error.response)
                else reject()
              }
            }
          } else reject()
        })
        .finally(() => {
          this.commit('setFormIsLoading', false)
        })
    })
  }
  /** Delete banner by bannerId */
  deleteBanner(id: Banner['id']) {
    return new Promise((resolve, reject) => {
      this.commit('startLoading')
      axios.delete(`/api/v1/banner/${id}`)
        .then(() => {
          if (isDev) console.log('Success: delete banner id=' + id)
          this.commit('setLoadingSuccess')
          resolve()
        })
        .catch((error: AxiosError<any>) => {
          if (isDev && error && error.response) console.log(error.response)
          else console.log('error')

          const errMsg = error && error.response && error.response.data && error.response.data.message || null
          this.commit('setLoadingFail', errMsg)
          reject()
        })
    })
  }
  /** Get single banner data by bannerId */
  getBannerById(id: Banner['id']) {
    return new Promise((resolve, reject) => {
      this.commit('startBannerCurrentLoading')

      axios.get(`/api/v1/banner/${id}`)
        .then((res: AxiosResponse<any>) => {
          this.commit('setBannerCurrentSuccess', res.data)
          this.dispatch('updateFormByBannerData', res.data)
          if (isDev) console.log('Success: get single banner id=' + id)
          resolve()
        })
        .catch((error: AxiosError<any>) => {
          if (isDev && error && error.response) console.log(error.response)
          else console.log('error')

          const errMsg = error && error.response && error.response.data && error.response.data.message || null
          this.commit('setBannerCurrentFail', errMsg)
          reject()
        })
    })
  }
  /** Action for form v-model fields. Updates proposed field and all related fields if they exist.
   * For example: activeFrom/activeTo, pageType / newsId / appLink
   */
  updateField({name, value}: {name: keyof BannerForm, value: FormField["value"]}) {
    const field = this.state.form.data.find(field => field.name === name)
    const activeFrom = this.state.form.data.find(f => f.name === 'activeFrom')
    const activeTo = this.state.form.data.find(f => f.name === 'activeTo')
    const appLink = this.state.form.data.find(f => f.name === 'appLink')
    const newsId = this.state.form.data.find(f => f.name === 'newsId')
    const isFormEdit = this.state.form.type === 'edit'

    this.commit('setField', {field, prop: 'value', value})

    const errorType = !field.value && field.validationRequired && 'empty' || 'default'
    const isValid = field.value && !!field.value.toString()
    this.commit('setField', {field, prop: 'errorType', value: errorType})
    this.commit('setField', {field, prop: 'isValid', value: isValid})

    switch (name) {
      case 'activeFrom':
        const activeFromErrorType = !!activeTo.value && 'emptyActiveFrom' || field.errorType
        this.commit('setField', {field, prop: 'errorType', value: activeFromErrorType})
        // this.commit('setField', {field: activeTo, prop: 'validationRequired', value: !!value})
        break

      case 'activeTo':
        const activeToErrorType = !!activeFrom.value && 'emptyActiveTo' || field.errorType
        this.commit('setField', {field, prop: 'errorType', value: activeToErrorType})
        // this.commit('setField', {field: activeFrom, prop: 'validationRequired', value: !!value})
        break

      case 'file':
        // @ts-ignore
        if (!value || !value.type) return

        // @ts-ignore
        const type = value.type
        for (const ext of this.state.imgExtensions) {
          const extChecked = type.includes(ext)
          this.commit('setField', {field, prop: 'isValid', value: extChecked})
          if (extChecked) return
        }

        if (!field.isValid && value) {
          this.commit('setField', {field, prop: 'value', value: null})
          this.commit('setField', {field, prop: 'errorType', value: 'imgExtension'})
        }
        break

      case 'isActive':
        if (field.value && isFormEdit) {
          // if delayedBanner was activated on pageEdit, runs immediate activation
          const isDelayedBanner = this.getters.bannerCurrentStatus === 'delayed'
          if (isDelayedBanner) {
            this.dispatch('updateField', { name: 'activeFrom', value: null })
            this.dispatch('updateField', { name: 'activeTo', value: null })
          }
        }
        break

      case 'newsId':
        if (!field.value) this.commit('setField', {field, prop: 'value', value: ''})
        const newsIdIsValid = !!Number(field.value)
        this.commit('setField', {field, prop: 'isValid', value: newsIdIsValid})
        if (value && value.toString() && !field.isValid) this.commit('setField', {field, prop: 'errorType', value: 'default'})
        break

      case 'pageType':
        if (field.value === 'news') {
          this.commit('setField', {field: newsId, prop: 'validationRequired', value: true})
          this.dispatch('updateField', ({name: 'newsId', value: newsId.value}))
          this.commit('setField', {field: appLink, prop: 'validationRequired', value: false})
        }
        else {
          this.commit('setField', {field: appLink, prop: 'validationRequired', value: true})
          this.dispatch('updateField', ({name: 'appLink', value: appLink.value}))
          this.commit('setField', {field: newsId, prop: 'validationRequired', value: false})
        }
        break

      case 'sort':
        const currValue = Number(field.value)
        const activeAmount = Number(this.state.activeAmount.value)
        const sortValue = Math.abs(currValue) > activeAmount && activeAmount ? activeAmount : Number(field.value) || activeAmount
        this.commit('setField', {field, prop: 'value', value: sortValue})
        break
    }

    const errorMsg = field.errorType && this.state.form.errors.find(f => f.type === field.errorType).msg
    this.commit('setField', {field, prop: 'errorMsg', value: errorMsg})
  }
  /** Update form by existing banner data */
  updateFormByBannerData(data: Banner) {
    const fields = this.state.form.data

    fields.forEach(field => {
      switch (field.name) {
        case 'file':
          this.dispatch('updateField', { name: field.name, value: data.bannerImageUrl })
          break
        case 'pageType':
          const pageTypes = this.state.pageTypes
          const value = data.pageType
          const indexOfReceived = pageTypes.indexOf(value)
          if (indexOfReceived < 0) this.commit('addPageType', value)

          this.dispatch('updateField', { name: field.name, value })
          break
        case 'sort':
          this.dispatch('updateField', { name: field.name, value: Math.abs(data.position).toString() })
          break
        default:
          this.dispatch('updateField', { name: field.name, value: data[field.name] })
          break
      }
    })
  }
  /** Deactivate banner by Id */
  deactivateBanner(id: Banner['id']) {
    return new Promise((resolve, reject) => {
      this.commit('startLoading')
      axios.post(`/api/v1/inactivate/${id}`)
        .then(() => {
          if (isDev) console.log('Success: deactivate banner id=' + id)
          this.commit('setLoadingSuccess')
          resolve()
        })
        .catch((err: AxiosError) => {
          if (isDev && err && err.response) console.log(err.response)
          else console.log('error')

          const errMsg = err && err.response && err.response.data && err.response.data.message
          this.commit('setLoadingFail', errMsg)
          reject()
        })
    })
  }
  /** Get active banners amount */
  async getActiveAmount() {
    return new Promise((resolve, reject) => {
      this.commit('startActiveAmountLoading')

      axios.get('/api/v1/active-count')
        .then((res: AxiosResponse<any>) => {
          this.commit('setActiveAmountSuccess', res.data.count)
          if (isDev) console.log('Success: get activeAmount: '+ res.data.count)
          resolve()
        })
        .catch((error: AxiosError) => {
          if (isDev && error && error.response) console.log(error.response)
          else console.log('error')

          const errMsg = error && error.response && error.response.data && error.response.data.message
          this.commit('setActiveAmountFail', errMsg)
          if (error && error.response) reject(error.response)
          else reject()
        })
    })
  }
  /** Change active banners amount */
  updateActiveAmount(payload: number) {
    return new Promise(async (resolve, reject) => {
      this.commit('startActiveAmountLoading')

      axios.post(`/api/v1/active-count/${payload}`)
        .then((res: AxiosResponse<any>) => {
          this.commit('setActiveAmountSuccess', res.data.count)
          if (isDev) console.log('Success: set activeAmount: ' + res.data.count)
          resolve()
        })
        .catch((error: AxiosError) => {
          if (isDev && error && error.response) console.log(error.response)
          else console.log('error')

          const errMsg = error && error.response && error.response.data && error.response.data.message
          this.commit('setActiveAmountFail', errMsg)
          reject()
        })
    })
  }
  /** Get bannes pageTypes list */
  getPageTypesList() {
    return new Promise(async (resolve, reject) => {
      this.commit('startLoading')

      axios.get('/api/v1/page-types')
        .then((res: AxiosResponse<any>) => {
          while (!Array.isArray(res)) res = res.data

          this.commit('setPageTypesList', res)
          this.commit('setLoadingSuccess')
          if (isDev) console.log('Success: get pageTypes')
          resolve()
        })
        .catch((error: AxiosError) => {
          if (isDev && error && error.response) console.log(error.response)
          else console.log('error')

          const errMsg = error && error.response && error.response.data && error.response.data.message
          this.commit('setLoadingFail', errMsg)
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

export const BannersStore = new Module({
  namespaced,
  state: BannersState,
  getters: BannersGetters,
  mutations: BannersMutations,
  actions: BannersActions
})

export const bannersMapper = createMapper(BannersStore)
