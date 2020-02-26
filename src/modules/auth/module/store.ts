import { AxiosResponse, AxiosError } from 'axios'
import { Form, AuthForm, FormField } from '../models'
import service from '@/client/index'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
import localStorageService from '@/services/localStorageService'

const namespaced = true

class AuthState {
  isLoading: boolean = false
  form: Form = {
    data: [
      { name: 'login', value: null, validationRequired: true, isValid: false, errorType: null, errorMsg: null },
      { name: 'pswd', value: null, validationRequired: true, isValid: false, errorType: null, errorMsg: null },
    ],
    error: null,
    errors: [
      { type: 'default', msg: 'Недопустимое значение' },
      { type: 'empty', msg: 'Поле не должно быть пустым' }
    ],
    isLoading: false,
    validationIsShown: false,
  }
}

class AuthGetters extends Getters<AuthState> {
  get formLogin() { return this.state.form.data.find(field => field.name === 'login') }
  get formPswd() { return this.state.form.data.find(field => field.name === 'pswd') }
  get formIsValid () {
    const required = this.state.form.data.filter(field => field.validationRequired)

    return required.every(field => field.isValid)
  }
  get formData() {
    const loginValue = this.getters.formLogin.value && this.getters.formLogin.value.toString() || ''
    const pswdValue = this.getters.formPswd.value && this.getters.formPswd.value.toString() || ''

    const formData = Object.assign({}, {'login': loginValue, 'password': pswdValue})

    return formData
  }
}

class AuthMutations extends Mutations<AuthState> {
  startFormLoading() {
    this.state.form.isLoading = true
  }
  setFormLoadingSuccess() {
    this.state.form.isLoading = false
    this.state.form.error = null
  }
  setFormLoadingFail(err) {
    this.state.form.isLoading = false
    this.state.form.error = err
  }
  setValidationIsShown(payload: boolean) { this.state.form.validationIsShown = payload }
  updateField({name, value}: {name: keyof AuthForm, value: FormField["value"]}) {
    const field = this.state.form.data.find(field => field.name === name)
    field.value = value
    field.errorType = !field.value && field.validationRequired && 'empty' || 'default'
    field.isValid = field.value && !!field.value.toString()
    field.errorMsg = field.errorType && this.state.form.errors.find(f => f.type === field.errorType).msg
  }
  clearForm() {
    const fields = this.state.form.data

    fields.forEach(field => {
      field.value = null
      field.isValid = false
      field.errorType = 'empty'
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

class AuthActions extends Actions<AuthState, AuthGetters, AuthMutations, AuthActions> {
  async sendForm() {
    return new Promise((resolve, reject) => {
      const formIsValid = this.getters.formIsValid

      if (!formIsValid) {
        this.commit('setValidationIsShown', true)
        reject()
        return
      }

      this.commit('startFormLoading')
      const data = this.getters.formData

      service.post('/login', data)
        .then((res: AxiosResponse<any>) => {
          localStorageService.setToken({access_token: res.data.token, refresh_token: res.data.refresh})
          this.commit('setFormLoadingSuccess')
          console.log('Success: formLogin sent')
          resolve()
        })
        .catch((error: AxiosError<any>) => {
          console.log(error.response)
          this.commit('setValidationIsShown', true)
          if (!!error.response && !!error.response.data){
            if (error.response.data.errors) {
              const errors = error.response.data.errors
              this.commit('handleFormErrors', errors)
            }
            if (error.response.data.message) this.commit('setEditFail', error.response.data.message)
          }
          reject()
        })
    })
  }
}

export const auth = new Module({
  namespaced,
  state: AuthState,
  getters: AuthGetters,
  mutations: AuthMutations,
  actions: AuthActions
})

export const authMapper = createMapper(auth)
