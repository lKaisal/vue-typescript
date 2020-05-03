import Vue from 'vue'
import Vuex from 'vuex'
import VuexStore from '@/services/store/store'
import Router from '@/services/router'
import { createStore } from 'vuex-smart-module'
import { Getters, Mutations, Actions, Module, createMapper, registerModule, unregisterModule, Context } from 'vuex-smart-module'
import { Store } from 'vuex'
import { UiStore } from '@/services/store/modules/ui/store'

Vue.use(Vuex as any)
const isDev = process && process.env && process.env.NODE_ENV === 'development'

class RootState {
}

class RootGetters extends Getters<RootState> {
}

class RootMutations extends Mutations<RootState> {
}

class RootActions extends Actions<RootState, RootGetters, RootMutations, RootActions> {
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
    }
  }),
  {
    strict: process.env.NODE_ENV !== 'production'
  }
)

export default store
