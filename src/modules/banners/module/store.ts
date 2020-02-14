// import { Module, GetterTree } from 'vuex'
import { AxiosResponse, AxiosError } from 'axios'
import { Banner, FormField, BannerForm, Form, FormType, BannerCurrent } from '../models'
import service from '../client/index'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
// import isAlpha from 'validator/lib/isAlpha'

const namespaced = true

class BannersState {
  activeAmount: {value: number, isLoading: boolean} = { value: null, isLoading: false }
  bannerCurrent: BannerCurrent = {
    data: null,
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
    errors: [
      { type: 'empty', msg: 'Поле не должно быть пустым' },
      { type: 'img-extension', msg: 'Загрузите изображение в формате .jpg или .png' },
      { type: 'default', msg: 'Недопустимое значение' }
    ],
    isLoading: false,
    type: null,
    validationIsShown: false,
  }
  imgExtensions: string[] = [ 'jpg', 'jpeg', 'png' ]
  isLoading: boolean = false // deleteBanner, inactivateBanner
  list: { data: Banner[], isLoading: boolean } = { data: null, isLoading: false }
  pageTypes: {displayed: string[], sent: string[]} = { displayed: ['Новость', 'Раздел'], sent: ['news', 'notnews'] }
}

class BannersGetters extends Getters<BannersState> {
  get isLoading() { return this.state.isLoading || this.state.activeAmount.isLoading || this.state.bannerCurrent.isLoading || this.state.form.isLoading || this.state.list.isLoading }
  get listActive() {
    return this.state.list.data.filter(item => item.isActive).sort((a, b) => {
      const sortA = a.position
      const sortB = b.position

      if (sortA > sortB) return 1
      else if (sortA < sortB) return -1
      else return 0
    })
  }
  get listInactive() {
    return this.state.list.data.filter(item => !item.isActive).sort((a, b) => {
      const updatedAtA = dateParser(a.updatedAt)
      const updatedAtB = dateParser(b.updatedAt)

      if (updatedAtA < updatedAtB) return 1
      else if (updatedAtA > updatedAtB) return -1
      else return 0
    })
  }
  get bannerById() {
    return (id: Banner['id']) => { return this.state.list.data && this.state.list.data.find(b => b.id.toString() === id.toString()) }
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
    const formData = Object.assign({})

    formData.activeForm = this.getters.formActiveFrom.value && this.getters.formActiveFrom.value.toString() || ''
    formData.activeTo = this.getters.formActiveTo.value && this.getters.formActiveTo.value.toString() || ''
    formData.appLink = this.getters.formAppLink.value && this.getters.formAppLink.value.toString() || ''
    formData.isActive = this.getters.formIsActive.value && this.getters.formIsActive.value.toString()
    formData.newsId = this.getters.formNewsId.value && this.getters.formNewsId.value.toString() || ''
    formData.pageType = this.getters.pageTypesSent[Number(this.getters.formPageType.value)].toString() || ''
    formData.sort = this.getters.formIsActive.value && this.getters.formSort.value && this.getters.formSort.value.toString() || this.state.activeAmount.value && this.state.activeAmount.value.toString()
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
  setIsLoading(payload: boolean) { this.state.isLoading = payload }
  saveList(payload: Banner[]) {
    this.state.list.data = payload
    this.state.list.isLoading = false
  }
  setListIsLoading(payload: boolean) { this.state.list.isLoading = payload }
  setBannerCurrent(payload: Banner) {
    this.state.bannerCurrent.data = payload
    this.state.bannerCurrent.isLoading = false
  }
  setBannerCurrentIsLoading(payload: boolean) { this.state.bannerCurrent.isLoading = payload }
  setActiveAmountIsLoading(payload: boolean) { this.state.activeAmount.isLoading = payload }
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
  setActiveAmount(payload: number) {
    this.state.activeAmount.value = payload
  }
}

class BannersActions extends Actions<BannersState, BannersGetters, BannersMutations, BannersActions> {
  async getList() {
    return new Promise((resolve, reject) => {
      this.commit('setListIsLoading', true)

      service.get('/api/v1/banners-list')
        .then((res: AxiosResponse<any>) => {
          while (!Array.isArray(res)) res = res.data

          this.commit('saveList', res)
          console.log('Success: load list')
          resolve()
        })
        .catch(error => {
          console.log(error.response)
          this.commit('saveList', null)
          reject()
        })
        .finally(() => {
          this.commit('setListIsLoading', false)
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
          this.commit('setBannerCurrent', res.data)
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
          this.commit('setBannerCurrent', res.data)
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
      this.commit('setIsLoading', true)
      service.delete(`/api/v1/banner/${id}`)
        .then(() => {
          console.log('Success: delete banner id=' + id)
          resolve()
        })
        .catch((error: AxiosError<any>) => {
          console.log(error.response)
          reject()
        })
        .finally(() => {
          this.commit('setIsLoading', false)
        })
    })
  }
  /** Get single banner data by bannerId */
  getBannerById(id: Banner['id']) {
    return new Promise((resolve, reject) => {
      this.commit('setIsLoading', true)
      service.get(`/api/v1/banner/${id}`)
        .then((res: AxiosResponse<any>) => {
          this.commit('setBannerCurrent', res.data)
          this.dispatch('updateFormByBannerData', res.data)
          console.log('Success: get single banner id=' + id)
          resolve()
        })
        .catch((error: AxiosError<any>) => {
          console.log(error.response)
          reject()
        })
        .finally(() => {
          this.commit('setIsLoading', false)
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

    field.value = value
    field.errorType = !field.value && field.validationRequired && 'empty' || 'default'
    field.isValid = field.value && !!field.value.toString()

    switch (name) {
      case 'activeFrom':
        activeTo.validationRequired = !!value
        break

      case 'activeTo':
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
          field.errorType = 'img-extension'
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
        field.value = (field.value > this.state.activeAmount.value && this.state.activeAmount.value) || !field.value ? this.state.activeAmount.value : field.value
        break
    }

    field.errorMsg = field.errorType && this.state.form.errors.find(f => f.type === field.errorType).msg
  }
  /** Update form by existing banner data */
  updateFormByBannerData(data: Banner) {
    const fields = this.state.form.data

    fields.forEach(field => {
      switch (field.name) {
        case 'activeFrom':
        case 'activeTo':
          console.log(data, data.activeFrom, data.activeTo)
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
          this.dispatch('updateField', { name: field.name, value: data[field.name] })
          break
      }
    })
  }
  /** Deactivate banner by Id */
  deactivateBanner(id: Banner['id']) {
    return new Promise((resolve, reject) => {
      this.commit('setIsLoading', true)
      service.post(`/api/v1/inactivate/${id}`)
        .then(() => {
          console.log('Success: deactivate banner id=' + id)
          resolve()
        })
        .catch((err: AxiosError) => {
          console.log(err.response)
          reject()
        })
        .finally(() => this.commit('setIsLoading', false))
    })
  }
  /** Get active banners amount */
  async getActiveAmount() {
    return new Promise((resolve, reject) => {
      this.commit('setActiveAmountIsLoading', true)

      service.get('/api/v1/active-count')
        .then((res: AxiosResponse<any>) => {
          this.commit('setActiveAmount', res.data.count)
          console.log('Success: get activeAmount: '+ res.data.count)
          resolve()
        })
        .catch((error: AxiosError) => {
          console.log(error.response)
          reject()
        })
        .finally(() => this.commit('setActiveAmountIsLoading', false))
    })
  }
  /** Change active banners amount */
  updateActiveAmount(payload: number) {
    return new Promise(async (resolve, reject) => {
      this.commit('setActiveAmountIsLoading', true)

      service.post(`/api/v1/active-count/${payload}`)
      .then((res: AxiosResponse<any>) => {
        this.commit('setActiveAmount', res.data.count)
        console.log('Success: set activeAmount: ' + res.data.count)
        resolve()
      })
      .catch((error: AxiosError) => {
        console.log(error.response)
        reject()
      })
      .finally(() => this.commit('setActiveAmountIsLoading', false))
    })
  }
}

const getNewsIdFromAppLink = (str) => {
  const regex = /\d+$/;

  return regex.exec(str)[0]
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
