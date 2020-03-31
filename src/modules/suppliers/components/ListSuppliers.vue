<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-suppliers
    +e.container
      +e.table
        //- table head
        +e.row.table-row(v-if="!isLtMd")
          +e.title.table-cell(v-for="(field, index) in fields"
            :class="{ 'col-075': field.isSmall, 'col-1': field.isMedium, 'col-11': field.isXMedium, 'col-2': !field.isSmall && !field.isMedium && !field.isXMedium, 'is-centered': field.isCentered }")
            +e.title-wrapper(@click="field.isSortable && onTitleClick(index)" :class="{ 'is-disabled': !list || !list.length }")
              +e.title-text(v-html="field.title")
              +e.title-sort(v-if="field.isSortable")
                +e.I.title-sort-icon.el-icon-caret-top(:class="{ 'is-active': listSortField === fields[index].field && isAscSorted }")
                +e.I.title-sort-icon.el-icon-caret-bottom(:class="{ 'is-active': listSortField === fields[index].field && isDescSorted }")
        //- table body
        ItemSuppliers(v-for="(item, index) in list" :key="index" :titleIsShown="isLtMd" :supplier="item" :fields="fields" @clicked="onItemClick(item)"
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
import { mapState } from 'vuex'
import { uiMapper } from '@/modules/ui/module/store'

const UiMappers = Vue.extend({
  computed: {
    ...uiMapper.mapState(['breakpoint'])
  }
})

const SuppliersMappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapState(['listSort']),
  },
  methods: {
    ...suppliersMapper.mapMutations(['updateListSort'])
  }
})

@Component({
  components: {
    ItemSuppliers,
    ButtonApp,
    MessageBox
  },
})

export default class ListSuppliers extends Mixins(SuppliersMappers, UiMappers, MsgBoxToolsApp, MsgBoxTools) {
  @Prop() list: Supplier[]
  breakpoint!: string

  get fields(): TableField[] { return [
    { field: 'supplierId', title: 'SupplierID', isSortable: true, isSmall: this.isLg || this.isMd, isMedium: this.isXl, isCentered: !this.isLtMd },
    { field: 'supplierName', title: 'Название поставщика', isSortable: true },
    { field: 'createdAt', title: 'Дата регистрации', isSortable: true },
    { field: 'createdAt', title: 'Дата последней активности*', isSortable: true },
    { field: 'userId', title: 'UserID', isSortable: true, isSmall: this.isMd, isMedium: this.isGtMd, isCentered: !this.isLtMd },
    { field: 'userName', title: 'Имя пользователя', isSortable: true, isCentered: !this.isLtMd },
    { field: 'inn', title: 'ИНН', isSortable: true, isSmall: this.isMd, isMedium: this.isGtMd, isCentered: !this.isLtMd },
    { field: 'phone', title: 'Телефон', isSortable: true, isSmall: false, isMedium: this.isLg || this.isMd, isXMedium: this.isXl, isCentered: !this.isLtMd },
    { field: 'confirmed', title: 'Статус пользователя', isSortable: false, isSmall: !this.isLtMd, isCentered: !this.isLtMd },
    { field: null, title: 'Открыть', isSortable: false, isSmall: this.isMd, isMedium: this.isGtMd, isCentered: !this.isLtMd }, // btn column
  ]}
  get isGtMd() { return this.breakpoint === 'xl' || this.breakpoint === 'lg' }
  get isLtMd() { return this.breakpoint === 'xs' || this.breakpoint === 'sm' }
  get isXl() { return this.breakpoint === 'xl' }
  get isLg() { return this.breakpoint === 'lg' }
  get isMd() { return this.breakpoint === 'md' }
  get amountTotal() { return this.list && this.list.length }
  get listSortField() { return this.listSort.by }
  get listSortDirection() { return this.listSort.direction }
  get isAscSorted() { return this.listSortDirection === 'asc' }
  get isDescSorted() { return this.listSortDirection === 'desc' }

  // SORT METHODS (TABLE HEAD)
  onTitleClick(index) {
    const by: ListSort['by'] = this.fields.map(f => f.field)[index]
    const byIsUpdated = by !== this.listSortField
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
    // font-size 14px
    +gt-md()
      width-between-property 'font-size' 1001 12 1440 14 true false
      width-between-property 'font-size' 1441 14 1920 16 false true
    +lt-md()
      font-size 14px
    &:not(:last-child)
      margin-bottom 100px
    &.v-enter
    &.v-leave-to
      opacity 0

  &__row
    display flex
    padding 10px 0

  &__table
    // margin-bottom 50px
    width 100%

  &__sort
    margin-bottom 50px

  &__title
    fontMedium()
    &:first-letter
      text-transform uppercase
    &.col-2:nth-of-type(2)
      flex-grow 1
    &:last-child
      z-index 1000
      position sticky
      right 0
      background-color white

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
        +lt-lg()
          transform translateY(3px)
      &:last-child
        transform translateY(-4px)
        +lt-lg()
          transform translateY(-3px)
      &.is-active
        color $cBrand

  &__item
    background-color white
    &:nth-of-type(2n + 1)
      background-color $cDisabled
</style>