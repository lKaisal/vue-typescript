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

type TableField = {
  field: keyof Section,
  title: string,
  isShown: boolean,
  isSmall?: boolean,
  isMedium?: boolean
}

type EditPayload = { id: number, active: boolean }[]

type RequestStatus = RequestStatuses[RequestType]

type RequestType = 'success' | 'fail' | 'other'

type RequestStatuses = {
  success: 'successFetchList' | 'successEdit'
  fail: 'failFetchList' | 'failEdit'
  other: 'beforeEdit'
}

export { Section, ListSort, TableField, EditPayload, RequestStatus, RequestType, RequestStatuses }