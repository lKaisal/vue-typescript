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
  pageType: string,
  position: number,
  sort: number,
  sortCalculated: number,
  updatedAt: string
}

type Form = {
  data: FormField[],
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

type FormError = {
  type: 'empty' | 'img-extension' | 'default',
  msg: string
}

type MsgBoxContent = {
  title: string,
  msg: string,
  firstBtn: string,
  secondBtn?: string
}

type RequestStatus = 'successFetchList' | 'failFetchList' | 'successFetchBanner' | 'failFetchBanner' | 'successCreate' | 'failCreate' | 'successEdit' | 'failEdit' | 'successDelete' | 
                     'failDelete' | 'beforeDelete' | 'failDeactivate' | 'failSetAmount'

type Button = {
  type: 'primary' | 'danger' | 'success' | 'warning' | 'info'
  isPlain?: boolean
  icon?: string
}

export { Banner, BannersState, BannerForm, Form, FormType, FormField, FormError, MsgBoxContent, RequestStatus, Button }