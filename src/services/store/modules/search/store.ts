import { Getters, Mutations, Actions, Module, createMapper } from 'vuex-smart-module'

const namespaced = true

class SearchState {
  fields: string[] = null
  searchField: string = null
  searchList: Object[] = null
  searchText: string = null
  uniqueField: string = null
}

class SearchGetters extends Getters<SearchState> {
  get allFields() {
    return Object.keys(this.state.searchList[0])
  }
  get searchFields() {
    return this.state.searchField ? [this.state.searchField] : this.state.fields
  }
  get notSearchFields() {
    return this.getters.allFields.filter(field => !this.getters.searchFields.includes(field))
  }
  get searchListCleared() {
    const list = [...this.state.searchList]

    if (!list) return

    const searchFields = this.getters.searchFields
    const notSearchFields = this.getters.notSearchFields

    if (searchFields && notSearchFields) {
      return list.map(el => {
        const newEl = Object.assign({})
        for (const key in el) {
          if (searchFields.includes(key)) newEl[key] = el[key]
        }

        return newEl
      })
    }
    else return list
  }
  get resultList() {
    const text = this.state.searchText
    const list = [...this.getters.searchListCleared]

    if (!text) return list

    return list.filter((fields, index) => {
      for (const key in fields) {
        const value = fields[key].toString().trim().toLowerCase()

        if (value.includes(text)) return true
      }
    })
  }
  get uniqueFieldsResult() {
    if (!this.getters.resultList) return

    return this.getters.resultList.map((el, index) => el[this.state.uniqueField])
  }
}

class SearchMutations extends Mutations<SearchState> {
  initSearch(payload: {list: Object[], fields?: string[], unique?: string}) {
    const { list, fields, unique } = payload
    this.state.searchList = list
    if (fields) this.state.fields = fields
    if (unique) this.state.uniqueField = unique
  }
  setUniqueField(payload: string) { this.state.uniqueField = payload }
  setSearchText(payload: string) { this.state.searchText = payload.toString().trim().toLowerCase() }
  setSearchField(payload: string) { this.state.searchField = payload }
}

class SearchActions extends Actions<SearchState, SearchGetters, SearchMutations, SearchActions> {
}

export const SearchStore = new Module({
  namespaced,
  state: SearchState,
  getters: SearchGetters,
  mutations: SearchMutations,
  actions: SearchActions,
})

export const searchMapper = createMapper(SearchStore)