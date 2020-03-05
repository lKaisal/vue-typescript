<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-suppliers
    +e.container
      +e.table(:class="{ 'is-long-list': list && list.length > 2 }")
        //- table head
        +e.row.table-row
          +e.title.table-cell(v-for="(field, index) in fields" :class="{ 'col-075': field.isSmall, 'col-2': !field.isSmall }")
            +e.title-wrapper(@click="onTitleClick(index)" :class="{ 'is-disabled': !list || !list.length }")
              +e.title-text(v-html="field.title")
              +e.title-sort(v-if="index !== fields.length - 1")
                +e.I.title-sort-icon.el-icon-caret-top(:class="{ 'is-active': listSortBy === fields[index].field && listSortDirection === 'asc' }")
                +e.I.title-sort-icon.el-icon-caret-bottom(:class="{ 'is-active': listSortBy === fields[index].field && listSortDirection === 'desc' }")
        //- table body
        ItemSuppliers(v-for="(item, index) in list" :key="index" :supplier="item" :fields="fields" @clicked="onItemClick(item)"
          class="list-suppliers__item table-row")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { suppliersMapper } from '../module/store'
import ItemSuppliers from '../components/ItemSuppliers.vue'
import ButtonApp from '@/components/ButtonApp.vue'
import { Supplier, ListSort, EditPayload, TableField } from '../models'
import MsgBoxTools from '../mixins/MsgBoxTools'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MessageBox from '@/components/MessageBox.vue'

const Mappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapState(['listSort']),
    // ...suppliersMapper.mapGetters(['listActive', 'listInactive'])
  },
  methods: {
    ...suppliersMapper.mapMutations(['updateListSort']),
    ...suppliersMapper.mapActions(['editList'])
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

  fields: { field: keyof Supplier, title: string, isSmall: boolean }[] = [
    { field: 'supplierId', title: 'SupplierID', isSmall: true },
    { field: 'supplierName', title: 'Название поставщика', isSmall: false },
    { field: 'inn', title: 'ИНН', isSmall: false },
    { field: 'userId', title: 'UserID', isSmall: true },
    { field: 'userName', title: 'Имя пользователя', isSmall: false },
    // { field: 'email', title: 'E-mail', isSmall: false },
    { field: null, title: '', isSmall: true },
  ]

  get amountTotal() { return this.list && this.list.length }
  get listSortBy() { return this.listSort.by }
  get listSortDirection() { return this.listSort.direction }

  @Watch('isActive', { immediate: true })
  onIsActiveChange(val) {
    this.resetSort()
  }

  // SORT METHODS (TABLE HEAD)
  onTitleClick(index) {
    const by: ListSort['by'] = this.fields.map(f => f.field)[index]
    const byIsUpdated = by !== this.listSortBy
    const direction: ListSort['direction'] = (byIsUpdated || this.listSortDirection === 'desc') ? 'asc' : 'desc'

    const listSort: ListSort = { by, direction }
    this.updateListSort(listSort)
  }
  resetSort() {
    const listSort: ListSort = { by: 'createdAt', direction: 'desc' }
    this.updateListSort(listSort)
  }
  // ITEMS METHODS
  onItemClick(item: Supplier) {
    this.$emit('itemClicked', item.userId)
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