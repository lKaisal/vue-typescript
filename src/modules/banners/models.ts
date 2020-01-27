import { StoreOptions } from 'vuex'

type BannersState = {
  list: Banner[],
  form: Form
}

type Banner = {
  id: number,
  createdAt: string,
  bannerImageUrl: string,
  bannerDate: string,
  sort: number,
  isActive: boolean,
  pageType: string
}

type Form = {
  data: FormField[]
  validationIsShown: boolean,
  errors: FormError[]
}

type FormField = {
  name: keyof BannerForm,
  value: BannerForm[FormField['name']],
  validationRequired: boolean,
  isValid: boolean,
  isFocused: boolean,
  isOptional: boolean,
  errorType: string,
  errorMsg: string
}

type BannerForm = {
  isActive: Boolean,
  file: Blob | File,
  newsId: Number,
  pageType: String,
  sort: Number
}

type FormError = {
  type: string,
  msg: string
}

type MsgBoxContent = {
  title: string,
  msg: string,
  loadBtn: string
}

export { Banner, BannersState, Form, BannerForm, FormField, MsgBoxContent }