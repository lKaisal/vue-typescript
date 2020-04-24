type News = {
  approved: boolean
  body: string
  bodyMobile: string
  created_at: boolean
  header: string
  headerMobile: string
  id: number
  preview: string
  previewMobile: string
  published: boolean
  pushed: boolean
  updated_at: boolean
}

type ListSort = {
  by: keyof News,
  direction: 'asc' | 'desc'
}

type TableField = {
  field: keyof News
  title: string
  value?: News[keyof News]
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
