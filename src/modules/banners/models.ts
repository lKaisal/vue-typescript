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
  delayStart: boolean,
  id: number,
  isActive: boolean,
  newsId: number,
  pageType: string,
  position: number,
  sort: number,
  title: string,
  updatedAt: string,
}

type SortUpdate = {
  id: Banner['id']
  oldPosition: Banner['sort']
  position: Banner['sort']
  loadingIsShown?: boolean
}

type BannerCurrent = {
  data: Banner,
  error: string,
  isLoading: boolean
}

type News = {
  created: string
  header: string
  id: Banner['newsId']
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

type RequestStatus = RequestStatuses[RequestType]

type RequestType = 'success' | 'fail' | 'other'

type RequestStatuses = {
  success: 'successCreate' | 'successEdit' | 'successDelete'
  fail: 'failFetchList' | 'failFetchBanner' | 'failCreate' | 'failEdit' | 'failDelete' | 'failDeactivate' | 'failSetAmount' | 'failSortUpdate' | 'failLoadAdditionalFormData'
  other: 'beforeDelete'
}

export { Banner, BannersState, BannerForm, BannerFormData, BannerCurrent, SortUpdate, News, Form, FormType, FormField, FormError,
  RequestStatus, RequestStatuses, RequestType }
