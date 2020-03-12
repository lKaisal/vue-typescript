<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-suppliers
    +e.container
      +e.table
        //- table head
        +e.row.table-row(v-if="!isLtMd")
          +e.title.table-cell(v-for="(field, index) in fields"
            :class="{ 'col-075': field.isSmall, 'col-1': field.isMedium, 'col-11': field.isXMedium, 'col-2': !field.isSmall && !field.isMedium && !field.isXMedium }")
            +e.title-wrapper(@click="onTitleClick(index)" :class="{ 'is-disabled': !list || !list.length }")
              +e.title-text(v-html="field.title")
              +e.title-sort(v-if="index !== fields.length - 1")
                +e.I.title-sort-icon.el-icon-caret-top(:class="{ 'is-active': listSortField === fields[index].field && listSortDirection === 'asc' }")
                +e.I.title-sort-icon.el-icon-caret-bottom(:class="{ 'is-active': listSortField === fields[index].field && listSortDirection === 'desc' }")
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

const Mappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapState(['listSort']),
    // ...suppliersMapper.mapGetters(['listActive', 'listInactive'])
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
  computed: {
    ...mapState('system', [
      'breakpoint'
    ])
  }
})

export default class ListSuppliers extends Mixins(Mappers, MsgBoxToolsApp, MsgBoxTools) {
  @Prop() list: Supplier[]
  breakpoint!: string

  get fields(): TableField[] { return [
    { field: 'supplierId', title: 'SupplierID', isSmall: !this.isXl, isMedium: this.isXl, isXMedium: false },
    { field: 'supplierName', title: 'Название поставщика', isSmall: false, isMedium: false, isXMedium: false },
    { field: 'userId', title: 'UserID', isSmall: !this.isGtMd, isMedium: this.isGtMd, isXMedium: false },
    { field: 'userName', title: 'Имя пользователя', isSmall: false, isMedium: false, isXMedium: false },
    { field: 'inn', title: 'ИНН', isSmall: this.isMd, isMedium: !this.isMd, isXMedium: false },
    { field: 'phone', title: 'Телефон', isSmall: false, isMedium: !this.isXl, isXMedium: this.isXl },
    { field: null, title: '', isSmall: true && !this.isLtMd, isMedium: this.isGtMd, isXMedium: false }, // btn column
  ]}
  get amountTotal() { return this.list && this.list.length }
  get listSortField() { return this.listSort.by }
  get listSortDirection() { return this.listSort.direction }
  get isGtMd() { return this.breakpoint === 'xl' || this.breakpoint === 'lg' }
  get isLtMd() { return this.breakpoint === 'xs' || this.breakpoint === 'sm' }
  get isXl() { return this.breakpoint === 'xl' }
  get isLg() { return this.breakpoint === 'lg' }
  get isMd() { return this.breakpoint === 'md' }

  @Watch('isActive', { immediate: true })
  onIsActiveChange(val) {
    this.resetSort()
  }

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