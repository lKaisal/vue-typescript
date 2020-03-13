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

type MenuItem = {
  alias: string,
  order: number,
  perrtutti_link: string,
  title: string,
}

export { MsgBoxContent, MsgBoxBtns, Button, CurrentDevice, SearchField, MenuItem }
