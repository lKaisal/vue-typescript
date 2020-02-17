// import { Module, GetterTree } from 'vuex'
import { AxiosResponse, AxiosError } from 'axios'
import { Banner, FormField, BannerForm, Form, FormType, BannerCurrent, BannerFormData } from '../models'
import service from '../client/index'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
// import isAlpha from 'validator/lib/isAlpha'
import getDateTime from '../mixins/getDateTime'

const namespaced = true

const today = new Date()
today.setHours(0,0,0,0)
const todayTime = today.getTime()

class BannersState {
  activeAmount: { value: number, error: string, isLoading: boolean } = { value: null, error: null, isLoading: false }
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
  imgExtensions: string[] = [ 'jpg', 'jpeg', 'png' ]
  isLoading: boolean = false // deleteBanner, deactivateBanner
  loadingError: string = null
  list: { data: Banner[], error: string, isLoading: boolean } = { data: null, error: null, isLoading: false }
  pageTypes: { displayed: string[], sent: string[] } = { displayed: ['Новость', 'Раздел'], sent: ['news', 'notnews'] }
}

class BannersGetters extends Getters<BannersState> {
  get isLoading() { return this.state.isLoading || this.state.activeAmount.isLoading || this.state.bannerCurrent.isLoading || this.state.form.isLoading || this.state.list.isLoading }
  get loadingError() { return this.state.loadingError || this.state.activeAmount.error || this.state.bannerCurrent.error || this.state.form.error || this.state.list.error }
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
    arr.forEach(item => item.type = 'active')

    return arr
  }
  get listDelayed() {
    if (!this.getters.listMastered) return

    const arr = this.getters.listMastered.filter(item => {
        if (!item.isActive && item.activeFrom && item.activeTo) return item.activeFromTime >= todayTime
      }).sort((a, b) => {
        const sortA = a.activeFromTime
        const sortB = b.activeFromTime

        if (sortA > sortB) return 1
        else if (sortA < sortB) return -1
        else return 0
      })
    arr.forEach(item => item.type = 'delayed')

    return arr
  }
  get listInactive() {
    if (!this.getters.listMastered) return

    const arr = this.getters.listMastered.filter(item => {
        return !item.isActive && (!item.activeFrom || item.activeFromTime < todayTime)
      }).sort((a, b) => {
        const updatedAtA = dateParser(a.updatedAt)
        const updatedAtB = dateParser(b.updatedAt)

        if (updatedAtA < updatedAtB) return 1
        else if (updatedAtA > updatedAtB) return -1
        else return 0
      })
    arr.forEach(item => item.type = 'inactive')

    return arr
  }
  get bannerById() {
    return (id: Banner['id']) => { return this.state.list.data && this.state.list.data.find(b => b.id.toString() === id.toString()) }
  }
  get bannerCurrentMastered() {
    if (!this.state.bannerCurrent) return

    const banner = this.state.bannerCurrent.data

    banner.activeFromTime = getDateTime(banner.activeFrom) || null
    banner.activeToTime = getDateTime(banner.activeTo) || null
    if (banner.isActive) banner.type = 'active'
    else if (banner.activeFrom && banner.activeTo && banner.activeFromTime >= todayTime) banner.type = 'delayed'
    else banner.type = 'inactive'

    return banner
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
    const isCreateForm = this.state.form.type === 'create'
    const formIsActiveValue = this.getters.formIsActive.value

    formData.activeFrom = (!formIsActiveValue || isCreateForm) && this.getters.formActiveFrom.value && this.getters.formActiveFrom.value.toString() || ''
    formData.activeTo = (!formIsActiveValue || isCreateForm) && this.getters.formActiveTo.value && this.getters.formActiveTo.value.toString() || ''
    formData.appLink = this.getters.formAppLink.value && this.getters.formAppLink.value.toString() || ''
    formData.isActive = this.getters.formIsActive.value && this.getters.formIsActive.value.toString()
    formData.newsId = this.getters.formNewsId.value && this.getters.formNewsId.value.toString() || ''
    formData.pageType = this.getters.pageTypesSent[Number(this.getters.formPageType.value)].toString() || ''
    formData.sort = formIsActiveValue && this.getters.formSort.value && this.getters.formSort.value.toString() || this.state.activeAmount.value && this.state.activeAmount.value.toString()
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
      console.log(err)
    }
  }
  get pageTypesDisplayed() { return this.state.pageTypes.displayed }
  get pageTypesSent() { return this.state.pageTypes.sent }
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
      field.value = field.name === 'isActive' || (field.name === 'sort' ? this.state.activeAmount.value : (field.name === 'pageType' ? 0 : null))
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
}

class BannersActions extends Actions<BannersState, BannersGetters, BannersMutations, BannersActions> {
  async getList() {
    return new Promise((resolve, reject) => {
      this.commit('startListLoading')

      service.get('/api/v1/banners-list')
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

      service.post('/api/v1/banner', data)
        .then((res: AxiosResponse<Banner>) => {
          this.commit('setValidationIsShown', false)
          this.commit('setBannerCurrentSuccess', res.data)
          this.dispatch('updateFormByBannerData', (res.data))
          console.log('Success: create banner id=' + res.data.id)
          resolve()
        })
        .catch((error: AxiosError<any>) => {
          console.log(error.response)
          this.commit('setValidationIsShown', true)
          if (!!error.response.data && error.response.data.errors) {
            const errors = error.response.data.errors
            if (errors.bannerId) reject({ bannerId: errors.bannerId })
            else {
              this.commit('handleFormErrors', errors)
              reject()
            }
          }
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

      service.put(`/api/v1/banner/${id}`, data)
        .then((res: AxiosResponse<Banner>) => {
          this.commit('setValidationIsShown', false)
          this.commit('setBannerCurrentSuccess', res.data)
          this.dispatch('updateFormByBannerData', (res.data))
          console.log('Success: edit banner id=' + res.data.id)
          resolve()
        })
        .catch((error: AxiosError<any>) => {
          console.log(error.response)
          this.commit('setValidationIsShown', true)
          if (!!error.response.data && error.response.data.errors) {
            const errors = error.response.data.errors
            if (errors.bannerId) reject({ bannerId: errors.bannerId })
            else {
              this.commit('handleFormErrors', error.response.data.errors)
              reject(error.response)
            }
          }
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
      service.delete(`/api/v1/banner/${id}`)
        .then(() => {
          console.log('Success: delete banner id=' + id)
          this.commit('setLoadingSuccess')
          resolve()
        })
        .catch((error: AxiosError<any>) => {
          console.log(error.response)
          this.commit('setLoadingFail', error.response.data.message)
          reject()
        })
    })
  }
  /** Get single banner data by bannerId */
  getBannerById(id: Banner['id']) {
    return new Promise((resolve, reject) => {
      this.commit('startBannerCurrentLoading')

      service.get(`/api/v1/banner/${id}`)
        .then((res: AxiosResponse<any>) => {
          this.commit('setBannerCurrentSuccess', res.data)
          this.dispatch('updateFormByBannerData', res.data)
          console.log('Success: get single banner id=' + id)
          resolve()
        })
        .catch((error: AxiosError<any>) => {
          console.log(error.response)
          this.commit('setBannerCurrentFail', error.response.data.message)
          reject()
        })
    })
  }
  /** Action for form v-model. Updates proposed field and all related fields if they exist.
   * For example: isActive / sort, pageType / newsId / appLink
   */
  updateField({name, value}: {name: keyof BannerForm, value: FormField["value"]}) {
    const field = this.state.form.data.find(field => field.name === name)
    const activeFrom = this.state.form.data.find(f => f.name === 'activeFrom')
    const activeTo = this.state.form.data.find(f => f.name === 'activeTo')
    const appLink = this.state.form.data.find(f => f.name === 'appLink')
    const newsId = this.state.form.data.find(f => f.name === 'newsId')

    // if (name === 'activeFrom' || name === 'activeTo') debugger
    field.value = value
    field.errorType = !field.value && field.validationRequired && 'empty' || 'default'
    field.isValid = field.value && !!field.value.toString()

    switch (name) {
      case 'activeFrom':
        field.errorType = !!activeTo.value && 'emptyActiveFrom' || field.errorType
        activeTo.validationRequired = !!value
        break

      case 'activeTo':
        field.errorType = !!activeFrom.value && 'emptyActiveTo' || field.errorType
        activeFrom.validationRequired = !!value
        break

      case 'file':
        // @ts-ignore
        if (!value || !value.type) return

        // @ts-ignore
        const type = value.type
        for (const ext of this.state.imgExtensions) {
          const extChecked = type.includes(ext)
          field.isValid = extChecked
          if (extChecked) return
        }

        if (!field.isValid && value) {
          field.value = null
          field.errorType = 'imgExtension'
        }
        break

      case 'newsId':
        field.isValid = !!Number(field.value)
        if (value && value.toString() && !field.isValid) field.errorType = 'default'
        break

      case 'pageType':
        if (field.value === 0) {
          newsId.validationRequired = true
          this.dispatch('updateField', ({name: 'newsId', value: newsId.value}))
          appLink.validationRequired = false
        }
        else {
          appLink.validationRequired = true
          this.dispatch('updateField', ({name: 'appLink', value: appLink.value}))
          newsId.validationRequired = false
        }
        break

      case 'sort':
        const currValue = Number(field.value)
        const activeAmount = Number(this.state.activeAmount.value)
        field.value = ((currValue > activeAmount || currValue <= 0) && this.state.activeAmount.value) || !currValue ? activeAmount : Number(field.value)
        break
    }

    field.errorMsg = field.errorType && this.state.form.errors.find(f => f.type === field.errorType).msg
  }
  /** Update form by existing banner data */
  updateFormByBannerData(data: Banner) {
    const fields = this.state.form.data
    console.log(data)

    fields.forEach(field => {
      switch (field.name) {
        case 'file':
          this.dispatch('updateField', { name: field.name, value: data.bannerImageUrl })
          break
        case 'pageType':
          const valueSent = data.pageType
          const index = this.getters.pageTypesSent.indexOf(valueSent)
          const value = index >= 0 ? index : 0
          this.dispatch('updateField', { name: field.name, value })
          break
        case 'sort':
          this.dispatch('updateField', { name: field.name, value: data.position.toString() })
          break
        default:
          if (field.name === 'activeFrom' || field.name === 'activeTo') console.log(data[field.name])
          this.dispatch('updateField', { name: field.name, value: data[field.name] })
          break
      }
    })
  }
  /** Deactivate banner by Id */
  deactivateBanner(id: Banner['id']) {
    return new Promise((resolve, reject) => {
      this.commit('startLoading')
      service.post(`/api/v1/inactivate/${id}`)
        .then(() => {
          console.log('Success: deactivate banner id=' + id)
          this.commit('setLoadingSuccess')
          resolve()
        })
        .catch((err: AxiosError) => {
          console.log(err.response)
          this.commit('setLoadingFail', err.response.data.message)
          reject()
        })
    })
  }
  /** Get active banners amount */
  async getActiveAmount() {
    return new Promise((resolve, reject) => {
      this.commit('startActiveAmountLoading')

      service.get('/api/v1/active-count')
        .then((res: AxiosResponse<any>) => {
          this.commit('setActiveAmountSuccess', res.data.count)
          console.log('Success: get activeAmount: '+ res.data.count)
          resolve()
        })
        .catch((error: AxiosError) => {
          this.commit('setActiveAmountFail', error.response.data.message)
          console.log(error.response)
          reject()
        })
    })
  }
  /** Change active banners amount */
  updateActiveAmount(payload: number) {
    return new Promise(async (resolve, reject) => {
      this.commit('startActiveAmountLoading')

      service.post(`/api/v1/active-count/${payload}`)
      .then((res: AxiosResponse<any>) => {
        this.commit('setActiveAmountSuccess', res.data.count)
        console.log('Success: set activeAmount: ' + res.data.count)
        resolve()
      })
      .catch((error: AxiosError) => {
        console.log(error.response)
        this.commit('setActiveAmountFail', error.response.data.message)
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

export const banners = new Module({
  namespaced,
  state: BannersState,
  getters: BannersGetters,
  mutations: BannersMutations,
  actions: BannersActions
})

export const bannersMapper = createMapper(banners)
