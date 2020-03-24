class SmsFields {
  lastSMS: string
  visitDate: string
  smsAttempts: number
  isActive: 'Активен' | 'Неактивен'
}

class Supplier extends SmsFields {
  createdAt: string
  email: string
  isActive: 'Активен' | 'Неактивен'
  inn: string
  phone: string
  phoneAuthId: number
  supplierId: number
  supplierName: string
  userId: number
  userName: string
}

namespace SupplierSMS {
  export class Supplier {}
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
  success: 'successFetchList' | 'successEdit'
  fail: 'failFetchList' | 'failEdit'
}

export { Supplier, SmsFields, ListSort, TableField, EditPayload, EditResponse, Country, RequestStatus, RequestType, RequestStatuses }