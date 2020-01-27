// import { Module, GetterTree } from 'vuex'
import { AxiosResponse, AxiosError } from 'axios'
import { Banner, FormField, BannerForm, Form } from '../models'
import service from '../client/index'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
// import isAlpha from 'validator/lib/isAlpha'

const namespaced = true

class BannersState {
  // return {
    list: Banner[] = []
    form: Form = {
      data: [
        {
          name: 'isActive',
          value: true,
          validationRequired: false,
          isValid: true,
          isFocused: false,
          isOptional: false,
          errorType: null,
          errorMsg: null,
        },
        {
          name: 'file',
          value: null,
          validationRequired: true,
          isValid: false,
          isFocused: false,
          isOptional: false,
          errorType: null,
          errorMsg: null,
        },
        {
          name: 'newsId',
          value: null,
          validationRequired: true,
          isValid: false,
          isFocused: false,
          isOptional: false,
          errorType: null,
          errorMsg: null,
        },
        {
          name: 'pageType',
          value: null,
          validationRequired: true,
          isValid: false,
          isFocused: false,
          isOptional: false,
          errorType: null,
          errorMsg: null,
        },
        {
          name: 'sort',
          value: null,
          validationRequired: false,
          isValid: true,
          isFocused: false,
          isOptional: true,
          errorType: null,
          errorMsg: null,
        }
      ],
      validationIsShown: false,
      errors: [
        { type: 'empty', msg: 'Поле не должно быть пустым' },
        { type: 'default', msg: 'Недопустимое значение' }
      ]
    }
  // }
}

class BannersGetters extends Getters<BannersState> {
  get listSorted() {
    return this.state.list && this.state.list.sort((a, b) => {
      const keyA = a.sort
      const keyB = a.sort

      if (keyA > keyB) return 1
      else if (keyA < keyB) return -1
      else return 0
    })
  }
  // FORM GETTERS
  get formIsActive() { return this.state.form.data.find(field => field.name === 'isActive') }
  get formFile() { return this.state.form.data.find(field => field.name === 'file') }
  get formNewsId() { return this.state.form.data.find(field => field.name === 'newsId') }
  get formPageType() { return this.state.form.data.find(field => field.name === 'pageType') }
  get formSort() { return this.state.form.data.find(field => field.name === 'sort') }
  get formIsValid () {
    const required = this.state.form.data.filter(field => !field.isOptional)
    const validFields = required.filter(field => field.isValid)

    return required.length <= validFields.length
  }
  get formData() {
    const formData = Object.assign({})

    formData.isActive = this.getters.formIsActive.value && this.getters.formIsActive.value.toString() || ''
    formData.file = this.getters.formFile.value
    formData.newsId = this.getters.formNewsId.value && this.getters.formNewsId.value.toString() || ''
    formData.pageType = this.getters.formPageType && this.getters.formPageType.toString() || ''
    formData.sort = this.getters.formSort && this.getters.formSort.toString() || ''

    return formData
  }
  get preparedFormData() {
    const formData = new FormData()

    Object.keys(this.getters.formData).forEach(key => {
      let value = this.getters.formData[key]
      formData.append(key, value)
    })

    return formData
  }
}

class BannersMutations extends Mutations<BannersState> {
  saveList(payload: Banner[]) { this.state.list = payload }
  // FORM MUTATIONS
  updateField({name, value}) {
    const field = this.state.form.data.find(field => field.name === name)
    field.value = value
    field.isValid = !!field.value
    field.errorType = !field.value && !field.isOptional && 'empty'
    field.errorMsg = field.errorType && this.state.form.errors.find(f => f.type === field.errorType).msg || ''
  }
  setValidationIsShown(payload) {
    this.state.form.validationIsShown = payload
  }
  clearForm() {
    const fields = this.state.form.data

    fields.forEach(field => {
      field.value = field.name === 'isActive' ? true : null
      field.isValid = (field.isOptional || !field.validationRequired) ? true : false
      field.isFocused = false
      field.errorType = !field.value && !field.isOptional && 'empty'
      field.errorMsg = field.errorType && this.state.form.errors.find(f => f.type === field.errorType).msg || ''
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
  async getList() {
    return new Promise((resolve, reject) => {
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
    })
  }
  async createBanner() {
    return new Promise((resolve, reject) => {
      const formIsValid = this.getters.formIsValid

      // if (!formIsValid) {
      //   commit('setValidationIsShown', true)
      //   reject()
      //   return
      // }

      const data = this.getters.preparedFormData
      // if (!data.sort.value) commit('updateField',{name: 'sort', value: state.list.length + 1})

      service.post('/api/v1/banner', data, {headers: {'Content-Type': 'multipart/form-data'}})
        .then((res: AxiosResponse<any>) => {
          this.commit('setValidationIsShown', false)
          resolve()
        })
        .catch((error: AxiosError<any>) => {
          console.log(error.response)
          this.commit('setValidationIsShown', true)
          if (!!error.response.data) this.commit('handleFormErrors', error.response.data.errors)
          reject(error.response)
        })
    })
  }
}

export const banners = new Module({
  namespaced,
  state: BannersState,
  getters: BannersGetters,
  mutations: BannersMutations,
  actions: BannersActions
})

export const bannersMapper = createMapper(banners)
