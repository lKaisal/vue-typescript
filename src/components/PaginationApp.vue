<template lang="pug">
  include ../tools/bemto.pug

  +b.pagination-app
    +e.container
      +e.EL-PAGINATION.pag(:background="!isLtMd" layout="prev, pager, next" :total="total" :page-size="pageSize" :currentPage.sync="currentPage" :pager-count="pagerCount"
        @current-change="onCurrentChange")
      +e.EL-SELECT.select(:value="pageSize" :placeholder="pageSize.toString()" @change="onSelectChange")
        +e.EL-OPTION.option(v-for="(option, index) in options" :key="index" :value="option")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { mapState } from 'vuex'
import { uiMapper } from '@/modules/ui/module/store'

const UiMappers = Vue.extend({
  computed: {
    ...uiMapper.mapState(['breakpoint'])
  },
})

@Component({
})

export default class PaginationApp extends UiMappers {
  @Prop() total: number
  @Prop() pageSize: number
  @Prop() pagerCount: number
  options: number[] = [ 10, 25, 50 ]
  currentPage: number = 1
  get isLtMd() { return this.breakpoint === 'xs' || this.breakpoint === 'sm' }

  @Watch('currentPage')
  onCurrentPageChange(val) {
    this.onCurrentChange(val)
  }
  onCurrentChange(n) {
    this.$emit('currentChange', n)
  }
  onSelectChange(n) {
    this.$emit('pageSizeChange', n)
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.pagination-app

  &__container
    +gt-sm()
      display flex
      justify-content space-between
      align-items center

  &__pag
    +xs()
      margin-bottom 25px

  &__select
    width 75px
    >>> input
      border 1px solid $cBrand !important
      +lt-md()
        padding-right 20px
        padding-left 10px
        font-size 14px
        height 35px
    >>> i
      color $cBrand !important
      +lt-md()
        line-height 35px
</style>