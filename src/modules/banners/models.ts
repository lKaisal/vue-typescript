type BannersState = {
  isLoading: boolean,
  list: Banner[],
  form: Form
}

type Banner = {
  activeFrom: string,
  activeFromTime?: number,
  activeTo: string,
  activeToTime: number,
  appLink: string,
  bannerDate: string,
  bannerImageUrl: string,
  createdAt: string,
  id: number,
  isActive: boolean,
  newsId: number,
  pageType: string,
  position: number,
  sort: number,
  sortCalculated: number,
  title: string,
  type: 'active' | 'delayed' | 'inactive',
  updatedAt: string
}

type BannerCurrent = {
  data: Banner,
  error: string,
  isLoading: boolean
}

type Form = {
  data: FormField[],
  error: string,
  errors: FormError[],
  isLoading: boolean,
  type: FormType,
  validationIsShown: boolean,
}

type FormType = 'create' | 'edit'

type FormField = {
  name: keyof BannerForm,
  value: BannerForm[FormField["name"]],
  validationRequired: boolean,
  isValid: boolean,
  errorType: FormError['type'],
  errorMsg: string
}

type BannerForm = {
  activeFrom: string,
  activeTo: string,
  appLink: string,
  isActive: boolean,
  file: File | Blob,
  newsId: number,
  pageType: string,
  sort: number,
  title: string
}

type Modify<T, R> = Omit<T, keyof R> & R
type BannerFormData = Modify<BannerForm, { isActive: string, file: string, newsId: string, sort: string }>

type FormError = {
  type: 'empty' | 'imgExtension' | 'default' | 'emptyActiveFrom' | 'emptyActiveTo',
  msg: string
}

type MsgBoxContent = {
  title: string,
  msg: string,
  firstBtn: string,
  secondBtn?: string
}

type RequestStatus = RequestStatuses[RequestType]

type RequestType = 'success' | 'fail' | 'other'

type RequestStatuses = {
  success: 'successCreate' | 'successEdit' | 'successDelete'
  fail: 'failFetchList' | 'failFetchBanner' | 'failCreate' | 'failEdit' | 'failDelete' | 'failDeactivate' | 'failSetAmount'
  other: 'beforeDelete'
}

type MsgBoxBtns = {
  firstBtn: string,
  secondBtn?: string
}

type Button = {
  type: 'primary' | 'danger' | 'success' | 'warning' | 'info'
  isPlain?: boolean
  icon?: string
}

export { Banner, BannersState, BannerForm, BannerFormData, BannerCurrent, Form, FormType, FormField, FormError, MsgBoxContent, RequestStatus, MsgBoxBtns, RequestStatuses, RequestType, Button }