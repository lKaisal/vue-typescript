type News = {
  id: number
  header: string
  headerMobile: string
  body: string
  bodyMobile: string
  published: boolean
  pushed: boolean
  created_at: boolean
  updated_at: boolean
}

type RequestStatus = RequestStatuses[RequestType]

type RequestType = 'success' | 'fail'

type RequestStatuses = {
  success: 'successFetchList'
  fail: 'failFetchList'
}

export { News, RequestStatus, RequestStatuses, RequestType }
