import { AxiosResponse, AxiosError } from 'axios'
// import { Banner, FormField, BannerForm, Form, FormType, BannerCurrent, BannerFormData } from '../models'
// import service from '../client/index'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'

const namespaced = true

class SectionsState {
  // 
}

class SectionsGetters extends Getters<SectionsState> {
  //
}

class SectionsMutations extends Mutations<SectionsState> {
  //
}

class SectionsActions extends Actions<SectionsState, SectionsGetters, SectionsMutations, SectionsActions> {
  //
}

export const sections = new Module({
  namespaced,
  state: SectionsState,
  getters: SectionsGetters,
  mutations: SectionsMutations,
  actions: SectionsActions
})

export const sectionsMapper = createMapper(sections)
