type News = {
  approved: boolean
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

type ListSort = {
  by: keyof News,
  direction: 'asc' | 'desc'
}

type TableField = {
  field: keyof News
  title: string
  isWidthCalculable?: boolean
  isSortable?: boolean
  isSmall?: boolean
  isMedium?: boolean
  isXMedium?: boolean
  isLarge?: boolean
  isXLarge?: boolean
  isCentered?: boolean
}

type RequestStatus = RequestStatuses[RequestType]

type RequestType = 'success' | 'fail'

type RequestStatuses = {
  success: 'successFetchList' | 'successFetchCurrentNews'
  fail: 'failFetchList' | 'failFetchCurrentNews'
}

export { News, ListSort, TableField, RequestStatus, RequestStatuses, RequestType }
