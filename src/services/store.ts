import Vue from 'vue'
import Vuex from 'vuex'
import VuexStore from '@/services/store'
import Router from '@/services/router'
import { createStore } from 'vuex-smart-module'
import { Getters, Mutations, Actions, Module, createMapper, registerModule, unregisterModule, Context } from 'vuex-smart-module'
import { Store } from 'vuex'
import { UiStore } from '@/modules/ui/module/store'
import { AuthStore } from '@/modules/auth/module/store'
import { MenuItem, DynamicModule, InitedModule } from '@/models'

Vue.use(Vuex as any)
const isDev = process && process.env && process.env.NODE_ENV === 'development'

class RootState {
}

class RootGetters extends Getters<RootState> {
  // init auth module
  auth!: Context<typeof AuthStore>
  $init(store: Store<any>): void {
    this.auth = AuthStore.context(store)
  }
  get menu() { return this.auth.state.menu }
}

class RootMutations extends Mutations<RootState> {
}

class RootActions extends Actions<RootState, RootGetters, RootMutations, RootActions> {
  initializeModule (payload: InitedModule ) {
    // init store module
    const mod = payload.module
    const storeModuleAdded = VuexStore.state[mod.name]
    if (!storeModuleAdded) registerModule(VuexStore, [mod.name], `${mod.name}/`, mod.store)

    // init module routes
    const fullPath = `/${payload.path}`
    const mathedComponents = Router.getMatchedComponents(fullPath)
    if (mathedComponents.length <= 1) {
      const meta = Object.assign(mod.routes[0].meta || {}, { title: payload.title })
      const routes = [Object.assign({}, ...mod.routes, { path: fullPath, meta })]
      Router.addRoutes(routes)
    }
  }
  removeModule (name: DynamicModule['name']) {
    VuexStore.unregisterModule(name)
  }
  async initializeModules () {
    try {
      const menu: MenuItem[] = this.getters.menu

      for (const mod of menu) {
        const moduleFolder = await import(`../modules/${mod.alias}/module`)
        const moduleFolderDefault: DynamicModule = moduleFolder.default
        const allFieldsNotEmpty: boolean = !!mod.alias && !!mod.order && !!mod.pertuttiLink && !!mod.title
        const dynamicModule: InitedModule = { module: moduleFolderDefault, path: mod.pertuttiLink, title: mod.title }

        if (moduleFolderDefault && allFieldsNotEmpty) this.dispatch('initializeModule', dynamicModule)
      }
    } catch(err) {
      if (isDev) console.log(err)
    }
  }
}

const store = createStore(
  new Module({
    namespaced: true,
    state: RootState,
    getters: RootGetters,
    mutations: RootMutations,
    actions: RootActions,
    modules: {
      UiStore,
      AuthStore
    }
  }),
  {
    strict: process.env.NODE_ENV !== 'production'
  }
)

export default store
