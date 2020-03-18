import { Module } from 'vuex-smart-module'

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

type LocalStorageObj = {
  access_token: string,
  refresh_token: string,
  menu: MenuItem[]
}

type LocalStorageRefreshObj = {
  token: string,
  refresh: string,
  menu: MenuItem[]
}

type MenuItem = {
  alias: string,
  order: number,
  pertuttiLink: string,
  title: string,
}

type InitedModule = {
  module: DynamicModule,
  path: string,
  title: string
}

type DynamicModule = {
  name: string,
  store: Module<any, any, any, any>,
  routes: any[]
}

export { MsgBoxContent, MsgBoxBtns, Button, CurrentDevice, SearchField, LocalStorageObj, LocalStorageRefreshObj, MenuItem, InitedModule, DynamicModule }
