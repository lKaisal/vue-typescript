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
  value: any,
  validationRequired: boolean,
  isValid: boolean,
  errorType: string,
  errorMsg: string
}

interface ActiveFrom extends FormField {
  name: 'activeFrom',
  value: string
}

interface ActiveTo extends FormField {
  name: 'activeTo',
  value: string
}

interface IsActive extends FormField {
  name: 'isActive',
  value: boolean
}

interface FileField extends FormField {
  name: 'file',
  value: File | Blob
}

interface NewsId extends FormField {
  name: 'newsId',
  value: number
}

interface PageType extends FormField {
  name: 'pageType',
  value: string
}

interface SortField extends FormField {
  name: 'sort',
  value: number
}

type BannerForm = {
  activeFrom: String,
  activeTo: String,
  isActive: Boolean,
  file: File | Blob,
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
  firstBtn: string,
  secondBtn?: string
}

type RequestStatus = 'successFetchList' | 'failFetchList' | 'successFetchBanner' | 'failFetchBanner' | 'successCreate' | 'failCreate' | 'successEdit' | 'failEdit' | 'successDelete' | 'failDelete' | 'beforeDelete'

type Button = {
  type: 'primary' | 'danger' | 'success' | 'warning' | 'info'
  isPlain?: boolean
  icon?: string
}

export { Banner, BannersState, BannerForm, Form, FormType, FormField, FormError, MsgBoxContent, RequestStatus, Button }