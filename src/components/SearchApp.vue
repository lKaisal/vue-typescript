<template lang="pug">
  include ../tools/bemto.pug

  +b.search-app
    +e.row
      +e.EL-INPUT.input(v-model="searchText" clearable placeholder="Поиск" :class="{ 'is-filled': searchText }"  @input="onSearchTextChange"
        @change="onSearchTextChange")
        +e.I.icon.el-icon-search.el-input__icon(v-if="!searchText" slot="suffix")
      +e.EL-SELECT.select(v-model="activeField" :disabled="!searchText" clearable placeholder="Поиск по полю" :class="{ 'is-filled': activeField }"
        @change="onActiveFieldChange")
        +e.EL-OPTION(v-for="(field, index) in fields" :key="index" :label="field.title" :value="field.field")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
// import * as JsSearch from 'js-search'
import { SearchField } from '@/models'

@Component({
  components: {
  }
})

export default class SearchApp extends Vue {
  @Prop() list: Object[]
  @Prop() fields: SearchField[]
  @Prop() uniqueFieldIndex: number
  activeField: string = null // EL-SELECT
  searchText: string = null // EL-INPUT
  search = null // JsSearch instance
  JsSearch!: any
  searchedList: Object[] = null
  listInitial: Object[] = null

  get uniqueField() { return this.fields[this.uniqueFieldIndex].field }

  @Watch('list', {deep:true, immediate: true})
  onListChange() {
    console.log('list upd ' + this.list.length + ' ' + new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds())
  }
  created() {
    this.searchedList = [...this.list]
    this.listInitial = [...this.list]
    // console.log('search created ' + new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds())
    // this.initSearch()
  }
  async initSearch(field?: SearchField['field']) {
    // this.JsSearch = await import ('js-search')
    // console.log('search inited ' + new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds())
    // this.search = new this.JsSearch.Search(this.uniqueField)
    // this.search.indexStrategy = new this.JsSearch.AllSubstringsIndexStrategy()

    // if (field) this.search.addIndex(field)
    // else {
    //   for (const field of this.fields) {
    //     this.search.addIndex(field.field)
    //   }
    // }

    // this.search.addDocuments([...this.list])
    // this.onSearchTextChange()
  }
  async onSearchTextChange() {
    if (!this.searchText) {
      this.$emit('searchFinished')
      await this.$nextTick()
      this.searchedList = this.listInitial
    } else {
      const textFormatted = this.searchText.toString().trim().toLowerCase()

      this.searchedList = this.listInitial.filter(supplier => {
        return this.fields.some((field, index) => {
          const supplierValue = supplier[field.field]
          const supplierValueFormatted = supplierValue.toString().trim().toLowerCase()
          return supplierValueFormatted.includes(textFormatted)
        })
      })

      this.$emit('searchProgress', this.searchedList)
    }
  }
  async onActiveFieldChange() {
    console.log(this.activeField)
    // // !!! reset list (or it will filter only list left after previous filter)
    // this.$emit('searchFinished')
    // await this.$nextTick()
    // this.search = null

    // // init JsSearch with (or without) activeField
    // this.initSearch(this.activeField)
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.search-app

  &__row
    display flex
    +xs()
      flex-wrap wrap

  &__select
    grid-size(4, 1, 1.1, 1.1, 1.25)
    min-width 175px

  &__input
    grid-size(4, 1.5, 2, 2, 2.4)
    min-width 200px
    +gt-sm()
      margin-right 10px
    +xs()
      margin-bottom 10px

  &__select
  &__input
    max-width 400px
    >>> input
      fontMedium()
      transition(border-color)
      width-between-property 'font-size' 1001 12 1440 14 true true
    &.is-filled
      >>> input
        border-color $cBrand
    >>> .el-icon-circle-close
      cursor pointer
</style>