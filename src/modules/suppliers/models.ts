class SmsFields {
  lastSmsCode: string
  lastVisit: string
  smsSendCount: number
  smsTryCount: number
  status: boolean
  userId: Supplier['userId']
}

class Supplier extends SmsFields {
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
  title: string,
  isSortable?: boolean,
  isSmall?: boolean,
  isMedium?: boolean,
  isXMedium?: boolean,
  isCentered?: boolean,
  isVariable?: boolean,
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
  success: 'successFetchList' | 'successEdit' | 'successFetchIdentity' | 'successResetSmsTryCount'
  fail: 'failFetchList' | 'failEdit' | 'failFetchIdentity' | 'failResetSmsTryCount'
}

export { Supplier, SmsFields, ListSort, TableField, EditPayload, EditResponse, Country, RequestStatus, RequestType, RequestStatuses }