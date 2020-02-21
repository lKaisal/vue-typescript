import { AxiosResponse, AxiosError } from 'axios'
import { Section } from '../models'
// import service from '../client/index'
import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'

const namespaced = true

class SectionsState {
  list: Section[] = [
    { id: 1, name: 'calendar', title: 'Каленадрь акций', isActive: true, description: 'Es irrt der Mensch, wenn er sie beim Kragen hätte. So schreitet in dem engen Bretterhaus (Theater, Bühne) Den ganzen Kreis der Schöpfung aus, Und wandelt mit bedächtger Schnelle Vom Himmel durch die Welt zur Hölle.' },
    { id: 2, name: 'price', title: 'Цены и скидки', isActive: true, description: 'Goodwill und sämtliche anderen immateriellen Vermögenswerte sind bei der Ermittlung des harten Kernkapitals am gesamten Eigenkapital.' },
    { id: 3, name: 'discount', title: 'Установка скидки', isActive: false, description: 'Imagine a combination of VOIP and Flash. Our end-to-end feature set is unparalleled, but our non-complex administration and newbie-proof use.' },
    { id: 4, name: 'goods', title: 'Мои товары', isActive: false, description: 'Note: Changed by section 1 of the Seventeenth Day of September in the Year one thousand eight hundred and eight...' },
    { id: 5, name: 'staff', title: 'Мои сотрудники', isActive: true, description: 'None of that prepared him for the arena, the crowd, the tense hush, the towering puppets of light from a half-open service hatch framed a heap of discarded fiber optics and the dripping chassis of a broken mirror bent and elongated as they fell.' },
  ]
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
