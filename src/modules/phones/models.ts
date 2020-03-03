type Service = {
  serviceName: string,
  replicas: number
}

type ListSort = {
  by: keyof Service,
  direction: 'asc' | 'desc'
}

type EditPayload = { serviceName: string }[]

type RequestStatus = RequestStatuses[RequestType]

type RequestType = 'success' | 'fail'

type RequestStatuses = {
  success: 'successFetchList' | 'successEdit'
  fail: 'failFetchList' | 'failEdit'
}

export { Service, ListSort, EditPayload, RequestStatus, RequestType, RequestStatuses }