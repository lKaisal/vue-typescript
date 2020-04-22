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

type ListSort = {
  by: keyof News,
  direction: 'asc' | 'desc'
}

type TableField = {
  field: keyof News,
  title: string,
  isWidthCalculable?: boolean,
  isSortable?: boolean,
  isSmall?: boolean,
  isMedium?: boolean,
  isLarge?: boolean,
  isXLarge?: boolean,
  isCentered?: boolean,
  isSticky?: boolean,
}

type RequestStatus = RequestStatuses[RequestType]

type RequestType = 'success' | 'fail'

type RequestStatuses = {
  success: 'successFetchList'
  fail: 'failFetchList'
}

export { News, ListSort, TableField, RequestStatus, RequestStatuses, RequestType }
