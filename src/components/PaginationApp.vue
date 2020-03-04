<template lang="pug">
  include ../tools/bemto.pug

  +b.pagination-app
    +e.container
      +e.EL-PAGINATION.pag(background layout="prev, pager, next" :total="total" :page-size="pageSize" :currentPage.sync="currentPage" @current-change="onCurrentChange")
      +e.EL-SELECT.select(:value="pageSize" :placeholder="pageSize.toString()" @change="onSelectChange")
        +e.EL-OPTION.option(v-for="(option, index) in options" :value="option")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'

@Component({
  components: {
  }
})

export default class PaginationApp extends Vue {
  @Prop() total: number
  @Prop() pageSize: number
  options: number[] = [ 15, 25, 50 ]
  currentPage: number = 1

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
    display flex
    justify-content space-between
    align-items center

  &__pag
    // margin-right 25px

  &__select
    width 75px
    >>> input
      border 1px solid $cBrand !important
    >>> i
      color $cBrand !important
</style>