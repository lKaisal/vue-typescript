import { AxiosResponse, AxiosError } from 'axios'
import { Form, AuthForm, FormField } from '../models'
import axios from '@/services/axios'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
import LocalStorageService from '@/services/LocalStorageService'
import { LocalStorageObj, LocalStorageRefreshObj, MenuItem } from '@/models'

const namespaced = true
const isDev = process && process.env && process.env.NODE_ENV === 'development'

class AuthState {
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
  menu: MenuItem[] = null
  tokens: { access: string, refresh: string } = {
    access:  null,
    refresh: null
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
  get isAuthorized() { return this.state.menu && this.state.tokens.access && this.state.tokens.refresh }
  get activeMenuSectionByLink() {
    return (link: MenuItem['pertuttiLink']) => { return this.state.menu && this.state.menu.find(sect => sect.pertuttiLink === link) }
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
  setFormLoadingFail(err: Form['error']) {
    this.state.form.isLoading = false
    this.state.form.error = err
  }
  setValidationIsShown(payload: boolean) { this.state.form.validationIsShown = payload }
  updateField({name, value}: {name: keyof AuthForm, value: FormField['value']}) {
    const field = this.state.form.data.find(field => field.name === name)
    field.value = value
    field.errorType = !field.value && field.validationRequired && 'empty' || 'default'
    field.isValid = field.value && !!field.value.toString()
    field.errorMsg = field.errorType && this.state.form.errors.find(f => f.type === field.errorType).msg
  }
  setFieldIsValid({name, value}: {name: keyof AuthForm, value: boolean}) {
    const field = this.state.form.data.find(field => field.name === name)
    field.isValid = value
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
  setMenu(payload: MenuItem[]) { this.state.menu = [...payload, { 'alias': 'news', 'order': 5, 'pertuttiLink': 'news', 'title': 'Новости' }] }
  setAccessToken(payload: string) { this.state.tokens.access = payload }
  setRefreshToken(payload: string) { this.state.tokens.refresh = payload }
}

class AuthActions extends Actions<AuthState, AuthGetters, AuthMutations, AuthActions> {
  updateLocalStorageData(payload: LocalStorageObj) {
    const { access_token, refresh_token, menu } = payload
    this.commit('setAccessToken', access_token)
    this.commit('setRefreshToken', refresh_token)
    this.commit('setMenu', menu)
  }
  async sendForm() {
    return new Promise((resolve, reject) => {
      const formIsValid = this.getters.formIsValid

      if (!formIsValid) {
        this.commit('setValidationIsShown', true)
        reject()
        return
      }

      this.commit('startFormLoading', null)
      const data = this.getters.formData

      axios.post('/login', data)
        .then((res: AxiosResponse<LocalStorageRefreshObj>) => {
          const { token, refresh, menu } = res.data
          const data: LocalStorageObj = { access_token: token, refresh_token: refresh, menu: menu }
          LocalStorageService.setToken(data)
          this.dispatch('updateLocalStorageData', data)
          this.commit('setFormLoadingSuccess', null)
          if (isDev) console.log('Success: formLogin sent')
          resolve()
        })
        .catch((error: AxiosError<any>) => {
          if (isDev && error && error.response) console.log(error.response)
          else console.log('error')
          this.commit('setValidationIsShown', true)
          const errMsg = !!error && !!error.response && !!error.response.data && error.response.data.message || null
          this.commit('setFormLoadingFail', errMsg)
          reject()
        })
    })
  }
}

export const AuthStore = new Module({
  namespaced,
  state: AuthState,
  getters: AuthGetters,
  mutations: AuthMutations,
  actions: AuthActions
})

export const authMapper = createMapper(AuthStore)
