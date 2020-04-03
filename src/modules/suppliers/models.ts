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
  contractType: string
  createdAt: string
  email: string
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
  isLarge?: boolean,
  isXLarge?: boolean,
  isCentered?: boolean,
  isVariable?: boolean,
  variableText?: string,
  isSticky?: boolean
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

type FilterItem = {
  field: keyof Supplier
  title: string
  values: Supplier[keyof Supplier][]
}

type RequestStatus = RequestStatuses[RequestType]

type RequestType = 'success' | 'fail' | 'other'

type RequestStatuses = {
  success: 'successFetchList' | 'successEdit' | 'successFetchIdentity' | 'successResetSmsTryCount' | 'successResetSmsSendCount' | 'successDeleteIdentity'
  fail: 'failFetchList' | 'failEdit' | 'failFetchIdentity' | 'failResetSmsTryCount' | 'failResetSmsSendCount' | 'failDeleteIdentity'
  other: 'beforeDeleteIdentity'
}

export { Supplier, SmsFields, ListSort, TableField, SmsTableField, EditPayload, EditResponse, Country, FilterItem, RequestStatus, RequestType, RequestStatuses }