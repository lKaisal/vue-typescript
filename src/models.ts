
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
 
export { MsgBoxContent, MsgBoxBtns, Button, CurrentDevice }
