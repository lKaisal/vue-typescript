<template lang="pug">
  include ../tools/bemto.pug

  +b.search-app
    +e.row
      +e.EL-INPUT.input(v-model="searchText" clearable placeholder="Поиск" @input="onSearchTextChange"
        @change="onSearchTextChange" :class="{ 'is-filled': searchText }")
        +e.I.icon.el-icon-search.el-input__icon(v-if="!searchText" slot="suffix")
      +e.EL-SELECT.select(v-model="activeField" clearable placeholder="Поиск по полю" :class="{ 'is-filled': activeField }"
        @change="onActiveFieldChange")
        +e.EL-OPTION(v-for="(field, index) in fields" :key="index" :label="field.title" :value="field.field")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
// import * as JsSearch from 'js-search'
import { SearchField } from '@/models'
import sleep from '@/mixins/sleep'

@Component({
  components: {
  }
})

export default class SearchApp extends Vue {
  @Prop() list: Object[]
  @Prop() fields: SearchField[]
  searchedList: Object[] = null
  listInitial: Object[] = null
  activeField: string = null // EL-SELECT
  searchText: string = null // EL-INPUT

  created() {
    this.initSearch()
  }

  // watchListOnce() {
  //   try {
  //     var unwatchList = this.$watch('list', (newVal) => {
  //       console.log('watch list search')
  //       if (newVal) {
  //         this.initSearch()
  //         unwatchList()
  //       }
  //     }, {immediate: true})
  //   } catch(err) {}
  // }
  async initSearch() {
    this.searchedList = [...this.list]
    this.listInitial = [...this.list]
  }
  async onSearchTextChange() {
    if (!this.searchText) {
      this.activeField = null
      await this.$nextTick()
      await sleep(0)
      this.$emit('searchFinished')
      await this.$nextTick()
      this.searchedList = this.listInitial
    } else {
      await this.$nextTick()
      await sleep(0)
      this.searchThroughList()
    }
  }
  async onActiveFieldChange() {
    await this.$nextTick()
    await sleep(0)
    this.searchThroughList()
  }
  async searchThroughList() {
    if (!this.searchText) {
      this.$emit('searchFinished')
      await sleep(0)
      await this.$nextTick()
      this.searchedList = this.listInitial

      return
    }
    const textFormatted = this.searchText.toString().trim().toLowerCase()

    const findText = (supplierValue) => {
      const supplierValueFormatted = supplierValue.toString().trim().toLowerCase()

      return supplierValueFormatted.includes(textFormatted)
    }

    this.searchedList = this.listInitial.filter(supplier => {
      if (this.activeField && this.searchText) return findText(supplier[this.activeField])
      else if (this.searchText) return this.fields.some((field, index) => findText(supplier[field.field]))
    })

    this.$emit('searchProgress', this.searchedList)
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
    >>> input
      border-left 0px

  &__input
    grid-size(4, 1.5, 2, 2, 2.4)
    min-width 200px
    +gt-sm()
      // margin-right 10px
    +xs()
      margin-bottom 10px
    >>> input
      border-left 0px

  &__select
  &__input
    max-width 400px
    >>> input
      border-radius 0
      fontMedium()
      transition(border-color)
      width-between-property 'font-size' 1001 12 1440 14 true true
    &.is-filled
      >>> input
        border-color $cBrand
    >>> .el-icon-circle-close
      cursor pointer
</style>