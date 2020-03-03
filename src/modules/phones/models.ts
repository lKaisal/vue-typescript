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

type RequestStatus = RequestStatuses[RequestType]

type RequestType = 'success' | 'fail'

type RequestStatuses = {
  success: 'successFetchList' | 'successEdit'
  fail: 'failFetchList' | 'failEdit'
}

export { Supplier, ListSort, EditPayload, RequestStatus, RequestType, RequestStatuses }