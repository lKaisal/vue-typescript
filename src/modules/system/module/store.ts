import VuexStore from '@/services/store'
import Router from '@/services/router'
import { registerModule, unregisterModule, Context } from 'vuex-smart-module'
import { CurrentDevice, MenuItem } from '@/models'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'
import { AuthStore } from '@/modules/auth/module/store'
// all modules
import banners from '@/modules/banners/module'
import features from '@/modules/features/module'
import restart from '@/modules/restart/module'
import suppliers from '@/modules/suppliers/module'
import { Store } from 'vuex'

const modulesFolders = { banners, features, restart, suppliers }
const namespaced = true
const isDev = process && process.env && process.env.NODE_ENV === 'development'

class RootState {
  currentDevice: CurrentDevice = null
  menuIsOpen: boolean = false
  modules: any[] = []
  breakpoint: string = null
}

class RootGetters extends Getters<RootState> {
  get isMobile() { return this.state.currentDevice.type === 'mobile' }
  get isTablet() { return this.state.currentDevice.type === 'tablet' }
  get isDesktop() { return this.state.currentDevice.type === 'desktop' }
  get isTouchDevice() { return this.state.currentDevice.type !== 'desktop' }
  get modules() { return this.state.modules && this.state.modules.filter(mod => mod.routes && mod.routes[0] && mod.routes[0].meta && mod.routes[0].meta.isDynamicModule) }
  // init auth module
  auth!: Context<typeof AuthStore>
  $init(store: Store<any>): void {
    this.auth = AuthStore.context(store)
  }
  get menu() { return this.auth.state.menu }
}

class RootMutations extends Mutations<RootState> {
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

class RootActions extends Actions<RootState, RootGetters, RootMutations, RootActions> {
  initializeModule (payload: { module: any, path: string, title: string } ) {
    // init store module
    const mod = payload.module
    const storeModuleAdded = VuexStore.state[mod.name]
    if (!storeModuleAdded) registerModule(VuexStore, [mod.name], `${mod.name}/`, mod.store)

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
    VuexStore.unregisterModule(name)
    this.commit('deleteModule', name)
  }
  initializeModules () {
    try {
      const menu: MenuItem[] = this.getters.menu

      for (const mod of menu) {
        const moduleFolder = modulesFolders[mod.alias]
        const allFieldsNotEmpty: boolean = !!mod.alias && !!mod.order && !!mod.pertuttiLink && !!mod.title
        console.log(mod, mod.alias , mod.order , mod.pertuttiLink , mod.title)
        if (moduleFolder && allFieldsNotEmpty) this.dispatch('initializeModule', { module: moduleFolder, path: mod.pertuttiLink, title: mod.title })
      }
    } catch {}
  }
}

export const RootStore = new Module({
  namespaced,
  state: RootState,
  getters: RootGetters,
  mutations: RootMutations,
  actions: RootActions,
  modules: {
    AuthStore
  }
})

export const rootMapper = createMapper(RootStore)