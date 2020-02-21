type Section = {
  active: boolean,
  createdAt: string,
  description: string,
  feature: string,
  id: number,
  name: string,
  updatedAt: string,
  username: string
}

type RequestStatus = RequestStatuses[RequestType]

type RequestType = 'success' | 'fail'

type RequestStatuses = {
  success: string
  fail: 'failFetchList'
}

export { Section, RequestStatus, RequestType, RequestStatuses }