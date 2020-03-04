type Supplier = {
  email: string,
  id: number,
  inn: string,
  name: string,
  phone: string,
}

type ListSort = {
  by: keyof Supplier,
  direction: 'asc' | 'desc'
}

type EditPayload = { serviceName: string }[]

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

export { Supplier, ListSort, EditPayload, Country, RequestStatus, RequestType, RequestStatuses }