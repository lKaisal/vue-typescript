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

type ListSort = {
  by: keyof Section,
  direction: 'asc' | 'desc'
}

type EditPayload = { id: number, active: boolean }[]

type RequestStatus = RequestStatuses[RequestType]

type RequestType = 'success' | 'fail'

type RequestStatuses = {
  success: string
  fail: 'failFetchList'
}

export { Section, ListSort, EditPayload, RequestStatus, RequestType, RequestStatuses }