import Store from '../../../services/store'
import Router from '../../../services/router'
import { registerModule, unregisterModule } from 'vuex-smart-module'
import { CurrentDevice, MenuItem } from '@/models'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
// modules
import banners from '@/modules/banners/module'
import features from '@/modules/features/module'
import restart from '@/modules/restart/module'
import suppliers from '@/modules/suppliers/module'

const modulesFolders = { banners, features, restart, suppliers }
const namespaced = true
const isDev = process && process.env && process.env.NODE_ENV === 'development'

class SystemState {
  currentDevice: CurrentDevice = null
  menuIsOpen: boolean = false
  modules: any[] = null
  breakpoint: string = null
}

class SystemGetters extends Getters<SystemState> {
  get isMobile() { return this.state.currentDevice.type === 'mobile' }
  get isTablet() { return this.state.currentDevice.type === 'tablet' }
  get isDesktop() { return this.state.currentDevice.type === 'desktop' }
  get isTouchDevice() { return this.state.currentDevice.type !== 'desktop' }
  get modules() { return this.state.modules && this.state.modules.filter(mod => mod.routes && mod.routes[0] && mod.routes[0].meta && mod.routes[0].meta.isDynamicModule) }
}

class SystemMutations extends Mutations<SystemState> {
  setCurrentDevice(payload: CurrentDevice) {
    const { orientation, type, os  } = payload
    this.state.currentDevice = Object.assign({}, { orientation, type, os } )
  }
  addModule(payload) {
    const indexOfModule = this.state.modules.map(m => m.name).indexOf(payload.name)
    if (indexOfModule < 0) this.state.modules.push(payload)
  }
  deleteModule(name) {
    const indexOfModule = this.state.modules.map(m => m.name).indexOf(name)
    if (indexOfModule >= 0) this.state.modules.splice(indexOfModule, 1)
  }
  toggleMenu() { this.state.menuIsOpen = !this.state.menuIsOpen }
  openMenu() { this.state.menuIsOpen = true }
  closeMenu() { this.state.menuIsOpen = false }
  setBreakpoint(payload: string) { this.state.breakpoint = payload }
}

class SystemActions extends Actions<SystemState, SystemGetters, SystemMutations, SystemActions> {
  initializeModule (payload: { module: any, path: string, title: string } ) {
    // init store module
    const mod = payload.module
    const storeModuleAdded = Store.state[mod.name]
    if (!storeModuleAdded) registerModule(Store, [mod.name], `${mod.name}/`, mod.store)

    // init routes
    const fullPath = `/${payload.path}`
    const mathedComponents = Router.getMatchedComponents(fullPath)
    if (mathedComponents.length <= 1) {
      const meta = Object.assign(mod.routes[0].meta || {}, { title: payload.title })
      const routes = [Object.assign({}, ...mod.routes, { path: fullPath, meta })]
      Router.addRoutes(routes)
    }

    this.commit('addModule', mod)
  }
  removeModule (name: any) {
    Store.unregisterModule(name)
    this.commit('deleteModule', name)
  }
  initializeModules () {
    try {
      const menu: MenuItem[] = this.rootState.auth.menu

      for (const mod of menu) {
        const moduleFolder = modulesFolders[mod.alias]
        const allFieldsNotEmpty: boolean = !!mod.alias && !!mod.order && !!mod.pertuttiLink && !!mod.title
        if (moduleFolder && allFieldsNotEmpty) this.dispatch('initializeModule', { module: moduleFolder, path: mod.pertuttiLink, title: mod.title })
      }
    } catch {}
  }
}

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
    modules: (state) => state.modules && state.modules.filter(mod => mod.routes && mod.routes[0] && mod.routes[0].meta && mod.routes[0].meta.isDynamicModule),
  },
  mutations: {
    setCurrentDevice(state, payload: CurrentDevice) {
      const { orientation, type, os  } = payload
      state.currentDevice = Object.assign({}, { orientation, type, os } )
    },
    addModule(state, payload) {
      const indexOfModule = state.modules.map(m => m.name).indexOf(payload.name)
      if (indexOfModule < 0) state.modules.push(payload)
    },
    deleteModule(state, name) {
      const indexOfModule = state.modules.map(m => m.name).indexOf(name)
      if (indexOfModule >= 0) state.modules.splice(indexOfModule, 1)
    },
    toggleMenu: (state) => state.menuIsOpen = !state.menuIsOpen,
    openMenu: (state) => state.menuIsOpen = true,
    closeMenu: (state) => state.menuIsOpen = false,
    setBreakpoint: (state, payload: string) => state.breakpoint = payload,
  },
  actions: {
    initializeModule ({ state, commit }, payload: { module: any, path: string, title: string } ) {
      // init store module
      const mod = payload.module
      const storeModuleAdded = Store.state[mod.name]
      if (!storeModuleAdded) registerModule(Store, [mod.name], `${mod.name}/`, mod.store)

      // init routes
      const fullPath = `/${payload.path}`
      const mathedComponents = Router.getMatchedComponents(fullPath)
      if (mathedComponents.length <= 1) {
        const meta = Object.assign(mod.routes[0].meta || {}, { title: payload.title })
        const routes = [Object.assign({}, ...mod.routes, { path: fullPath, meta })]
        Router.addRoutes(routes)
      }

      commit('addModule', mod)
    },
    removeModule ({ commit }, name: any) {
      Store.unregisterModule(name)
      commit('deleteModule', name)
    },
    initializeModules ({ state, dispatch, rootState, rootGetters }) {
      try {
        const menu: MenuItem[] = rootState.auth.menu
  
        for (const mod of menu) {
          const moduleFolder = modulesFolders[mod.alias]
          const allFieldsNotEmpty: boolean = !!mod.alias && !!mod.order && !!mod.pertuttiLink && !!mod.title
          if (moduleFolder && allFieldsNotEmpty) dispatch('initializeModule', { module: moduleFolder, path: mod.pertuttiLink, title: mod.title })
        }
      } catch {}
    }
  }
}

export const system = new Module({
  namespaced,
  state: SystemState,
  getters: SystemGetters,
  mutations: SystemMutations,
  actions: SystemActions
})

export const systemMapper = createMapper(system)