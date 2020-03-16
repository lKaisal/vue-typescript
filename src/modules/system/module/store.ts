import Store from '../../../services/store'
import Router from '../../../services/router'
import { registerModule, unregisterModule } from 'vuex-smart-module'
import { CurrentDevice, MenuItem } from '@/models'

export default {
  namespaced: true,
  state: {
    currentDevice: { orientation: null, type: null, os: null } as CurrentDevice,
    menuIsOpen: false as boolean,
    modules: [],
    breakpoint: null as string,
  },
  getters: {
    isMobile: (state) => state.currentDevice.type === 'mobile',
    isTablet: (state) => state.currentDevice.type === 'tablet',
    isDesktop: (state) => state.currentDevice.type === 'desktop',
    isTouchDevice: (state) => state.currentDevice.type !== 'desktop',
    modules: (state) => state.modules && state.modules.filter(m => m.meta && m.meta.isDynamicModule),
  },
  mutations: {
    setCurrentDevice(state, payload: CurrentDevice) {
      const { orientation, type, os  } = payload
      state.currentDevice = Object.assign({}, { orientation, type, os } )
    },
    addModule(state, payload) { state.modules.push(payload) },
    toggleMenu: (state) => state.menuIsOpen = !state.menuIsOpen,
    openMenu: (state) => state.menuIsOpen = true,
    closeMenu: (state) => state.menuIsOpen = false,
    setBreakpoint: (state, payload: string) => state.breakpoint = payload,
  },
  actions: {
    initializeModule ({ state, commit }, module: any) {
      registerModule(Store, [module.name], `${module.name}/`, module.store)
      Router.addRoutes(module.routes)
      commit('addModule', ...module.routes)
    },
    removeModule ({ dispatch }, module: any) {
      Store.unregisterModule(module.name)
    }
  }
}
