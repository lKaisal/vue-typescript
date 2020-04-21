type RequestStatus = RequestStatuses[RequestType]

type RequestType = 'success' | 'fail'

type RequestStatuses = {
  success: 'successFetchList'
  fail: 'failFetchList'
}

export { RequestStatus, RequestStatuses, RequestType }
