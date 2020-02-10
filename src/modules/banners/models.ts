type BannersState = {
  isLoading: boolean,
  list: Banner[],
  form: Form
}

type Banner = {
  activeFrom: string,
  activeTo: string,
  appLink: string,
  bannerDate: string,
  bannerImageUrl: string,
  createdAt: string,
  id: number,
  isActive: boolean,
  newsId: number,
  pageType: string
  sort: number,
  sortCalculated: number
}

type Form = {
  data: FormField[],
  errors: FormError[],
  type: FormType,
  validationIsShown: boolean,
}

type FormType = 'create' | 'edit'

type FormField = {
  name: keyof BannerForm,
  value: BannerForm[FormField["name"]],
  validationRequired: boolean,
  isValid: boolean,
  errorType: string,
  errorMsg: string
}

type BannerForm = {
  activeFrom: String,
  activeTo: String,
  isActive: Boolean,
  file: File | Blob,
  newsId: Number,
  pageType: String,
  sort: Number,
}

type FormError = {
  type: string,
  msg: string
}

type MsgBoxContent = {
  title: string,
  msg: string,
  firstBtn: string,
  secondBtn?: string
}

type RequestStatus = 'successFetchList' | 'failFetchList' | 'successFetchBanner' | 'failFetchBanner' | 'successCreate' | 'failCreate' | 'successEdit' | 'failEdit' | 'successDelete' | 'failDelete' | 'beforeDelete' | 'failDeactivate'

type Button = {
  type: 'primary' | 'danger' | 'success' | 'warning' | 'info'
  isPlain?: boolean
  icon?: string
}

export { Banner, BannersState, BannerForm, Form, FormType, FormField, FormError, MsgBoxContent, RequestStatus, Button }