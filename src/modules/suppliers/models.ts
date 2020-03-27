type SmsFields = {
  lastCodeExpired: number // через сколько секунд перестанет работать счетчик
  lastSmsCode: string
  lastVisit: string
  sendMaxCount: number // максимально допустимое число смс в сутки
  smsSendCount: number // кол-во отправленных смс
  smsTryCount: number // кол-во попыток ввода смс
  status: boolean
  tryMaxCount: number // максимально допустимое число попыток ввода смс
  userId: Supplier['userId']
}

type Supplier = {
  confirmed: boolean
  createdAt: string
  email: string
  status: boolean
  inn: string
  phone: string
  phoneAuthId: number
  supplierId: number
  supplierName: string
  userId: number
  userName: string
}

type ListSort = {
  by: keyof Supplier,
  direction: 'asc' | 'desc'
}

type TableField = {
  field: keyof Supplier,
  fields?: undefined,
  title: string,
  isSortable?: boolean,
  isSmall?: boolean,
  isMedium?: boolean,
  isXMedium?: boolean,
  isCentered?: boolean,
  isVariable?: boolean,
  variableText?: string
}

type SmsTableField = {
  field?: undefined
  fields: (keyof SmsFields)[]
  title: string
  isVariable?: boolean
  variableText?: string
}

type EditPayload = {
  phoneAuthId: Supplier['phoneAuthId'],
  phone: Supplier['phone']
}

type EditResponse = {
  phone: Supplier['phone'],
  phoneAuthId: Supplier['phoneAuthId'],
  supplierId: Supplier['supplierId'],
  userId: Supplier['userId']
}

type Country = {
  name: string,
  code: string,
  phoneCode: number,
  mask: string
}

type RequestStatus = RequestStatuses[RequestType]

type RequestType = 'success' | 'fail'

type RequestStatuses = {
  success: 'successFetchList' | 'successEdit' | 'successFetchIdentity' | 'successResetSmsTryCount' | 'successResetSmsSendCount' | 'successDeleteIdentity'
  fail: 'failFetchList' | 'failEdit' | 'failFetchIdentity' | 'failResetSmsTryCount' | 'failResetSmsSendCount' | 'failDeleteIdentity'
}

export { Supplier, SmsFields, ListSort, TableField, SmsTableField, EditPayload, EditResponse, Country, RequestStatus, RequestType, RequestStatuses }