import { CurrentDevice } from '@/models'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'

const namespaced = true

class UiState {
  currentDevice: CurrentDevice = null
  menuIsOpen: boolean = false
  breakpoint: string = null
}

class UiGetters extends Getters<UiState> {
  get isMobile() { return this.state.currentDevice.type === 'mobile' }
  get isTablet() { return this.state.currentDevice.type === 'tablet' }
  get isDesktop() { return this.state.currentDevice.type === 'desktop' }
  get isTouchDevice() { return this.state.currentDevice.type !== 'desktop' }
}

class UiMutations extends Mutations<UiState> {
  setCurrentDevice(payload: CurrentDevice) {
    const { orientation, type, os  } = payload
    this.state.currentDevice = Object.assign({}, { orientation, type, os } )
  }
  toggleMenu() { this.state.menuIsOpen = !this.state.menuIsOpen }
  openMenu() { this.state.menuIsOpen = true }
  closeMenu() { this.state.menuIsOpen = false }
  setBreakpoint(payload: string) { this.state.breakpoint = payload }
}

class UiActions extends Actions<UiState, UiGetters, UiMutations, UiActions> {
}

export const UiStore = new Module({
  namespaced,
  state: UiState,
  getters: UiGetters,
  mutations: UiMutations,
  actions: UiActions,
})

export const uiMapper = createMapper(UiStore)