<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-suppliers
    +e.container
      +e.table(:class="{ 'is-long-list': list && list.length > 2 }")
        //- table head
        +e.row.table-row
          +e.title.table-cell(v-for="(title, index) in tableTitles" :class="{ 'col-05': index === 0, 'col-2': index > 0 }")
            +e.title-wrapper(@click="onTitleClick(index)" :class="{ 'is-disabled': !list || !list.length }")
              +e.title-text(v-html="title")
              +e.title-sort
                +e.I.title-sort-icon.el-icon-caret-top(:class="{ 'is-active': listSortBy === fields[index] && listSortDirection === 'asc' }")
                +e.I.title-sort-icon.el-icon-caret-bottom(:class="{ 'is-active': listSortBy === fields[index] && listSortDirection === 'desc' }")
        //- table body
        ItemSuppliers(v-for="(item, index) in list" :key="index" :supplier="item"
          class="list-suppliers__item table-row")

      //- ButtonApp(v-if="list.length" :text="btnText" :btnType="btnType" class="list-suppliers__btn")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { phonesMapper } from '../module/store'
import ItemSuppliers from '../components/ItemSuppliers.vue'
import ButtonApp from '@/components/ButtonApp.vue'
import { Supplier, ListSort, EditPayload } from '../models'
import MsgBoxTools from '../mixins/MsgBoxTools'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MessageBox from '@/components/MessageBox.vue'

const Mappers = Vue.extend({
  computed: {
    ...phonesMapper.mapState(['listSort', 'hashes']),
    // ...phonesMapper.mapGetters(['listActive', 'listInactive'])
  },
  methods: {
    ...phonesMapper.mapMutations(['updateListSort']),
    ...phonesMapper.mapActions(['editList'])
  }
})

@Component({
  components: {
    ItemSuppliers,
    ButtonApp,
    MessageBox
  }
})

export default class ListSuppliers extends Mixins(Mappers, MsgBoxToolsApp, MsgBoxTools) {
  @Prop() list: Supplier[]
  @Prop() isActive: boolean

  tableTitles: string[] = [ 'id', 'Название', 'ИНН', 'Телефон', 'E-mail' ]
  fields: (keyof Supplier)[] = [ 'id', 'name', 'inn', 'phone', 'email' ]

  get amountTotal() { return this.list && this.list.length }
  get listSortBy() { return this.listSort.by }
  get listSortDirection() { return this.listSort.direction }
  get btnText() { return this.isActive ? 'Деактивировать' : 'Активировать' }
  get btnType() { return this.isActive ? 'warning' : 'success' }

  @Watch('isActive', { immediate: true })
  onIsActiveChange(val) {
    this.resetSort()
  }

  // SORT METHODS (TABLE HEAD)
  onTitleClick(index) {
    const by: ListSort['by'] = this.fields[index]
    const byIsUpdated = by !== this.listSortBy
    const direction: ListSort['direction'] = (byIsUpdated || this.listSortDirection === 'desc') ? 'asc' : 'desc'

    const listSort: ListSort = { by, direction }
    this.updateListSort(listSort)
  }
  resetSort() {
    const listSort: ListSort = { by: 'id', direction: 'asc' }
    this.updateListSort(listSort)
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../common'

.list-suppliers

  &__container
    width 100%
    transition(opacity)
    &:not(:last-child)
      margin-bottom 100px
    &.v-enter
    &.v-leave-to
      opacity 0

  &__row
    display flex
    padding 10px 0

  &__table
    margin-bottom 50px
    width 100%

  &__sort
    margin-bottom 50px

  &__title
    fontMedium()
    &:first-letter
      text-transform uppercase
    &.col-2:nth-of-type(2)
      flex-grow 1

  &__title-wrapper
    display flex
    align-items center
    padding 10px
    margin -10px
    transition(opacity)
    cursor pointer
    user-select none
    &:hover
      opacity .75
    &.is-disabled
      pointer-events none

  &__title-text
    margin-right 3px

  &__title-sort
    display flex
    flex-direction column
    i
      color $cSecondaryText
      transition(color)
      &:first-child
        transform translateY(4px)
      &:last-child
        transform translateY(-4px)
      &.is-active
        color $cBrand

  &__item
    background-color white
    .is-long-list &
      &:nth-of-type(2n + 1)
        background-color $cDisabled
</style>