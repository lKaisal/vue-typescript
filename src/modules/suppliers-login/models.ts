type Supplier = {
  createdAt: string,
  email: string,
  inn: string,
  phone: string,
  phoneAuthId: number,
  supplierId: number,
  supplierName: string,
  userId: number,
  userName: string,
}

type ListSort = {
  by: keyof Supplier,
  direction: 'asc' | 'desc'
}

type TableField = {
  field: keyof Supplier,
  title: string,
  isSmall?: boolean,
  isMedium?: boolean
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

export { Supplier, ListSort, TableField, EditPayload, EditResponse, Country, RequestStatus, RequestType, RequestStatuses }