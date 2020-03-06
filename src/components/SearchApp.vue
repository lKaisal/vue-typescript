<template lang="pug">
  include ../tools/bemto.pug

  +b.search-app
    +e.row
      +e.EL-SELECT.select(v-model="activeField" clearable placeholder="Поиск по полю" :class="{ 'is-filled': activeField }")
        +e.EL-OPTION(v-for="(field, index) in fields" :key="index" :label="field.title" :value="field.field")
      +e.EL-INPUT.input(v-model="searchText" placeholder="Поиск" :class="{ 'is-filled': searchText }")
        +e.I.icon.el-icon-search.el-input__icon(slot="suffix")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import * as JsSearch from 'js-search'

@Component({
  components: {
  }
})

export default class SearchApp extends Vue {
  @Prop() list: any[]
  @Prop() fields: {field: string, title: string}[]
  activeField: string = null
  searchText: string = null
  searchTextStored: string = null
  search = null

  @Watch('searchText', { immediate: true })
  onSearchTextChange(val) {
    this.searchTextChangeHandler()
  }
  @Watch('activeField')
  async onActiveFieldChange(val) {
    // reset list (or it will filter only previously filtered list)
    this.$emit('searchFinished')
    await this.$nextTick()
    this.search = null

    // set this.search with (or without) activeField
    if (val) this.initSingleFieldSearch(val)
    else this.initSearch()
  }

  created() {
    this.initSearch()
  }
  async initSearch() {
    this.search = new JsSearch.Search(this.fields[0])
    this.search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy()

    for (const field of this.fields) {
      this.search.addIndex(field.field)
    }

    this.search.addDocuments([...this.list])
    this.searchTextChangeHandler()
  }
  async initSingleFieldSearch(field) {
    this.search = new JsSearch.Search(field)
    this.search.indexStrategy = new JsSearch.AllSubstringsIndexStrategy()

    this.search.addIndex(field)
    this.search.addDocuments([...this.list])
    this.searchTextChangeHandler()
  }
  searchTextChangeHandler() {
    if (!this.searchText) this.$emit('searchFinished')
    else {
      const searchRes = this.search.search(this.searchText.toString())
      this.$emit('searchProgress', searchRes)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.search-app

  &__row
    display flex

  &__select
    margin-right 10px

  &__input
    grid-size(4, 2, 2, 2, 2)

  &__select
  &__input
    >>> input
      transition(border-color)
    &.is-filled
      >>> input
        border-color $cBrand
</style>