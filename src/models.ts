type MsgBoxContent = {
  title: string,
  msg: string,
  firstBtn: string,
  secondBtn?: string
}

type MsgBoxBtns = {
  firstBtn: string,
  secondBtn?: string
}

type Button = {
  type: 'primary' | 'danger' | 'success' | 'warning' | 'info'
  isPlain?: boolean
  icon?: string
}

type CurrentDevice = {
  orientation: string,
  type: string,
  os: string
}

type SearchField = {
  field: string,
  title: string
}

type LocalStorage = {
  access_token: string,
  refresh_token: string,
  menu: MenuItem[]
}

type MenuItem = {
  alias: string,
  order: number,
  pertuttiLink: string,
  title: string,
}

export { MsgBoxContent, MsgBoxBtns, Button, CurrentDevice, SearchField, LocalStorage, MenuItem }
