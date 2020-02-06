// import { Module, GetterTree } from 'vuex'
import { AxiosResponse, AxiosError } from 'axios'
import { Banner, FormField, BannerForm, Form, FormType, FormError } from '../models'
import service from '../client/index'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
// import isAlpha from 'validator/lib/isAlpha'

const namespaced = true

class BannersState {
  // return {
    isLoading: boolean = false
    list: Banner[] = null
    form: Form = {
      type: null,
      validationIsShown: false,
      errors: [
        { type: 'empty', msg: 'Поле не должно быть пустым' },
        { type: 'default', msg: 'Недопустимое значение' }
      ],
      data: [
        { name: 'activeFrom', value: null, validationRequired: false, isValid: false, errorType: null, errorMsg: null },
        { name: 'activeTo', value: null, validationRequired: false, isValid: false, errorType: null, errorMsg: null },
        { name: 'isActive', value: true, validationRequired: false, isValid: true, errorType: null, errorMsg: null },
        { name: 'file', value: null, validationRequired: true, isValid: false, errorType: null, errorMsg: null },
        { name: 'newsId', value: null, validationRequired: false, isValid: false, errorType: null, errorMsg: null },
        { name: 'pageType', value: null, validationRequired: true, isValid: false, errorType: null, errorMsg: null },
        { name: 'sort', value: 4, validationRequired: true, isValid: true, errorType: null, errorMsg: null }
      ],
    }
    activeAmount: number = 4
  // }
}

class BannersGetters extends Getters<BannersState> {
  get listSorted() {
    const list = this.state.list

    if (!list || !list.length) return

    const listSorted = list.sort((a, b) => {
      const keyA = a.sort
      const keyB = b.sort

      if (keyA > keyB) return 1
      else if (keyA < keyB) return -1
      else return 0
    })

    const listActiveIds = listSorted.filter(item => item.isActive).map(b => b.id)
    listSorted.forEach((b, index) => b.isActive ? b.sortCalculated = listActiveIds.indexOf(b.id) + 1 : b.sortCalculated = null)

    return listSorted
  }
  get listActive() { return this.getters.listSorted.filter(item => item.isActive) }
  get listInactive() { return this.getters.listSorted.filter(item => !item.isActive) }
  get bannerById() {
    return (id: Banner['id']) => { return this.state.list && this.state.list.find(b => b.id.toString() === id.toString()) }
  }
  // FORM GETTERS
  get formActiveFrom() { return this.state.form.data.find(field => field.name === 'activeFrom') }
  get formActiveTo() { return this.state.form.data.find(field => field.name === 'activeTo') }
  get formIsActive() { return this.state.form.data.find(field => field.name === 'isActive') }
  get formFile() { return this.state.form.data.find(field => field.name === 'file') }
  get formNewsId() { return this.state.form.data.find(field => field.name === 'newsId') }
  get formPageType() { return this.state.form.data.find(field => field.name === 'pageType') }
  get formSort() { return this.state.form.data.find(field => field.name === 'sort') }
  get formIsValid () {
    const required = this.state.form.data.filter(field => field.validationRequired)

    return required.every(field => field.isValid)
  }
  get formData() {
    const formData = Object.assign({})

    formData.activeForm = this.getters.formActiveFrom.value && this.getters.formActiveFrom.value.toString() || ''
    formData.activeTo = this.getters.formActiveTo.value && this.getters.formActiveTo.value.toString() || ''
    formData.isActive = this.getters.formIsActive.value && this.getters.formIsActive.value.toString() || ''
    formData.newsId = this.getters.formNewsId.value && this.getters.formNewsId.value.toString() || ''
    formData.pageType = this.getters.formPageType.value && this.getters.formPageType.value.toString() || ''
    formData.sort = this.getters.formIsActive.value && this.getters.formSort.value && this.getters.formSort.value.toString() || ''

    // @ts-ignore
    if (this.getters.formFile.value && this.getters.formFile.value.type) formData.file = this.getters.formFile.value
    else formData.file = null

    return formData
  }
  get preparedFormData() {
    const formData = new FormData()

    Object.keys(this.getters.formData).forEach(key => {
      const value = this.getters.formData[key]
      if (!!value || this.state.form.type === 'create') formData.append(key, value)
    })

    return formData
  }
}

class BannersMutations extends Mutations<BannersState> {
  setIsLoading(payload: boolean) { this.state.isLoading = payload }
  saveList(payload: Banner[]) { this.state.list = payload }
  // FORM MUTATIONS
  setFormType(payload: FormType) { this.state.form.type = payload }
  setValidationIsShown(payload) {
    this.state.form.validationIsShown = payload
  }
  clearForm() {
    const fields = this.state.form.data

    fields.forEach(field => {
      field.value = field.name === 'isActive' || (field.name === 'sort' ? this.state.activeAmount : null)
      field.isValid = field.name === 'sort'
      field.validationRequired = field.name === 'file' || field.name === 'pageType' || field.name === 'sort'
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
      }
    }
  }
}

class BannersActions extends Actions<BannersState, BannersGetters, BannersMutations, BannersActions> {
  updateField({name, value}: {name: keyof BannerForm, value: FormField["value"]}) {
    const field = this.state.form.data.find(field => field.name === name)

    field.value = value

    switch (name) {
      case 'isActive':
        const sort = this.state.form.data.find(f => f.name === 'sort')
        if (field.value) {
          sort.validationRequired = true
          this.dispatch('updateField', ({ name: 'sort', value: sort.value }))
        } else {
          sort.validationRequired = false
          this.dispatch('updateField', ({name: 'sort', value: null}))
        }
        field.isValid = !!field.value
        break
      case 'newsId':
        const pageType = this.state.form.data.find(f => f.name === 'pageType')
        if (pageType.value !== 'news') field.validationRequired = false
        field.isValid = !!field.value
        break
      case 'pageType':
        const newsId = this.state.form.data.find(f => f.name === 'newsId')
        if (field.value === 'news') {
          newsId.validationRequired = true
          this.dispatch('updateField', ({name: 'newsId', value: newsId.value}))
        }
        else newsId.validationRequired = false
        field.isValid = !!field.value
        break
      case 'sort':
        field.value = sort.value > this.state.activeAmount || !sort.value ? this.state.activeAmount : sort.value

        const isActive = this.state.form.data.find(f => f.name === 'isActive')
        if (isActive.value) field.validationRequired = true
        else field.validationRequired = false
        field.isValid = !isActive.value || !!field.value
        break
      default:
        field.isValid = !!field.value
    }

    field.errorType = !field.value && field.validationRequired && 'empty'
    field.errorMsg = field.errorType && this.state.form.errors.find(f => f.type === field.errorType).msg || ''
  }
  async getList() {
    return new Promise((resolve, reject) => {
      this.commit('setIsLoading', true)

      service.get('/api/v1/banners-list')
        .then((res: AxiosResponse<any>) => {
          while (!Array.isArray(res)) res = res.data

          this.commit('saveList', res)
          resolve()
        })
        .catch(error => {
          console.log(error.response)
          reject()
        })
        .finally(() => {
          this.commit('setIsLoading', false)
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
      
      this.commit('setIsLoading', true)
      const data = this.getters.preparedFormData

      service.post('/api/v1/banner', data)
        .then((res: AxiosResponse<Banner>) => {
          this.commit('setValidationIsShown', false)
          resolve(res.data.id)
        })
        .catch((error: AxiosError<any>) => {
          console.log(error.response)
          this.commit('setValidationIsShown', true)
          if (!!error.response.data && error.response.data.errors) this.commit('handleFormErrors', error.response.data.errors)
          reject(error.response)
        })
        .finally(() => {
          this.commit('setIsLoading', false)
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

      this.commit('setIsLoading', true)
      const data = this.getters.preparedFormData

      service.put(`/api/v1/banner/${id}`, data)
        .then((res: AxiosResponse<Banner>) => {
          this.commit('setValidationIsShown', false)
          resolve(res.data.id)
        })
        .catch((error: AxiosError<any>) => {
          console.log(error.response)
          this.commit('setValidationIsShown', true)
          if (!!error.response.data && error.response.data.errors) this.commit('handleFormErrors', error.response.data.errors)
          reject(error.response)
        })
        .finally(() => {
          this.commit('setIsLoading', false)
        })
    })
  }
  /** Delete banner by bannerId */
  deleteBanner(id: Banner['id']) {
    return new Promise((resolve, reject) => {
      this.commit('setIsLoading', true)
      service.delete(`/api/v1/banner/${id}`)
        .then(() => resolve())
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
          resolve(res.data)
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
  /** Update form by existing banner data */
  updateFormByBannerData(data: Banner) {
    const fields = this.state.form.data

    fields.forEach(field => {
      switch (field.name) {
        case 'activeFrom':
          this.dispatch('updateField', { name: field.name, value: data.activeFrom })
          break
        case 'activeTo':
          this.dispatch('updateField', { name: field.name, value: data.activeTo })
          break
        case 'isActive':
          this.dispatch('updateField', { name: field.name, value: data.isActive })
          break
        case 'file':
          this.dispatch('updateField', { name: field.name, value: data.bannerImageUrl })
          break
        case 'newsId':
          this.dispatch('updateField', { name: field.name, value: data.appLink && getNewsIdFromAppLink(data.appLink) })
          break
        case 'pageType':
          this.dispatch('updateField', { name: field.name, value: data.pageType })
          break
        case 'sort':
          this.dispatch('updateField', { name: field.name, value: data.sortCalculated || data.sort }) // HACK: // FIXME: takes sortCalculated value, not sort (sort may be a huge number)
          break
        }
    })
  }
}

const getNewsIdFromAppLink = (str) => {
  const regex = /\d+$/;

  return regex.exec(str)[0]
}

export const banners = new Module({
  namespaced,
  state: BannersState,
  getters: BannersGetters,
  mutations: BannersMutations,
  actions: BannersActions
})

export const bannersMapper = createMapper(banners)
