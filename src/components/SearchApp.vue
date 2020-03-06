<template lang="pug">
  include ../tools/bemto.pug

  +b.search-app
    +e.container
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
  @Prop() fields: any
  searchText: string = null
  search = null

  @Watch('searchText')
  onSearchTextChange(val) {
    if (!val) this.$emit('searchFinished')
    else {
      const searchRes = this.search.search(val.toString())
      this.$emit('searchProgress', searchRes)
    }
  }
  created() {
    this.initSearch()
  }
  initSearch() {
    this.search = new JsSearch.Search('supplierId')
    // for (const field of this.fields) {
    //   this.search.addIndex(field)
    // }
    this.search.addIndex('supplierName')

    this.search.addDocuments(this.list)
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.search-app

  &__input
    grid-size(4, 2, 2, 2, 2)
    >>> input
      transition(border-color)
    &.is-filled
      >>> input
        border-color $cBrand
</style>