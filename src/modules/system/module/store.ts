import { CurrentDevice, MenuItem } from '@/models'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'

const namespaced = true
const isDev = process && process.env && process.env.NODE_ENV === 'development'

class SystemState {
  currentDevice: CurrentDevice = null
  menuIsOpen: boolean = false
  breakpoint: string = null
}

class SystemGetters extends Getters<SystemState> {
  get isMobile() { return this.state.currentDevice.type === 'mobile' }
  get isTablet() { return this.state.currentDevice.type === 'tablet' }
  get isDesktop() { return this.state.currentDevice.type === 'desktop' }
  get isTouchDevice() { return this.state.currentDevice.type !== 'desktop' }
}

class SystemMutations extends Mutations<SystemState> {
  setCurrentDevice(payload: CurrentDevice) {
    const { orientation, type, os  } = payload
    this.state.currentDevice = Object.assign({}, { orientation, type, os } )
  }
  toggleMenu() { this.state.menuIsOpen = !this.state.menuIsOpen }
  openMenu() { this.state.menuIsOpen = true }
  closeMenu() { this.state.menuIsOpen = false }
  setBreakpoint(payload: string) { this.state.breakpoint = payload }
}

class SystemActions extends Actions<SystemState, SystemGetters, SystemMutations, SystemActions> {
}

export const SystemStore = new Module({
  namespaced,
  state: SystemState,
  getters: SystemGetters,
  mutations: SystemMutations,
  actions: SystemActions,
})

export const systemMapper = createMapper(SystemStore)