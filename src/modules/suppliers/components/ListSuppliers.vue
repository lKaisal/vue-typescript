<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-suppliers
    +e.container
      +e.table(ref="tableRef" :class="{ 'is-horiz-scrolled': horizontalOverscroll }")
        //- table head
        +e.row.table-row(v-if="!isLtMd")
          +e.title.table-cell(v-for="(field, index) in fields" ref="titleRef" :style="setCellStyle(index)"
            :class=`[{ 'is-sticky': field.isSticky && isHorizontalOverscroll, 'col-075': field.isSmall, 'col-1': field.isMedium, 'col-11': field.isXMedium,
              'col-2': field.isLarge, 'col-3': field.isXLarge, 'is-centered': field.isCentered }]`)
            +e.title-wrapper(@click="field.isSortable && onTitleClick(index)" :class="{ 'is-disabled': !list || !list.length }")
              +e.title-text(v-html="field.title")
              +e.title-sort(v-if="field.isSortable")
                +e.I.title-sort-icon.el-icon-caret-top(:class="{ 'is-active': listSortField === fields[index].field && isAscSorted }")
                +e.I.title-sort-icon.el-icon-caret-bottom(:class="{ 'is-active': listSortField === fields[index].field && isDescSorted }")
        //- table body
        ItemSuppliers(v-for="(item, index) in list" :key="index" :titleIsShown="isLtMd" :supplier="item" :fields="fields" :widths="maxWidths"
          @clicked="onItemClick(item)" ref="itemRef"
          class="list-suppliers__item table-row")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch, Ref } from 'vue-property-decorator'
import { suppliersMapper } from '../module/store'
import ItemSuppliers from '../components/ItemSuppliers.vue'
import ButtonApp from '@/components/ButtonApp.vue'
import { Supplier, ListSort, EditPayload, TableField } from '../models'
import MsgBoxTools from '../mixins/MsgBoxTools'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MessageBox from '@/components/MessageBox.vue'
import { mapState } from 'vuex'
import { uiMapper } from '@/modules/ui/module/store'
import sleep from '@/mixins/sleep'

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
  @Ref() tableRef!: HTMLElement
  @Ref() titleRef!: HTMLElement[]
  @Ref() itemRef!: ItemSuppliers[]
  breakpoint!: string
  horizontalOverscroll: number = 0
  mouseIsDown: boolean = false
  startX: number = null
  scrollLeft: number = null
  isStickyLeft: boolean = false
  isStickyRight: boolean = false
  maxWidths: number[] = []

  get maxWidthsSum() { return this.maxWidths.reduce((acc, curr) => acc += curr) }
  get fields(): TableField[] { return [
    { field: 'supplierId', title: 'SupplierID', width: null, isSortable: true, isSmall: this.isLg || this.isMd, isMedium: this.isXl, isCentered: !this.isLtMd },
    { field: 'supplierName', title: 'Название поставщика', width: null, isSortable: true, isXLarge: true, isSticky: this.isStickyLeft },
    { field: 'createdAt', title: 'Дата регистрации', width: null, isSortable: true, isMedium: true, isCentered: true },
    // { field: 'createdAt', title: 'Дата последней активности*', isSortable: true, isMedium: true, isCentered: true },
    { field: 'contractType', title: 'Тип договора', width: null, isSortable: true, isMedium: true, isCentered: true },
    { field: 'userId', title: 'UserID', width: null, isSortable: true, isSmall: this.isMd, isMedium: this.isGtMd, isCentered: !this.isLtMd },
    { field: 'userName', title: 'Имя пользователя', isSortable: true, width: null, isMedium: true, isCentered: !this.isLtMd },
    { field: 'inn', title: 'ИНН', width: null, isSortable: true, isSmall: this.isMd, isMedium: this.isGtMd, isCentered: !this.isLtMd },
    { field: 'phone', title: 'Телефон', width: null, isSortable: true, isSmall: false, isMedium: this.isLg || this.isMd, isXMedium: this.isXl, isCentered: !this.isLtMd },
    { field: 'confirmed', title: 'Статус пользователя', width: null, isSortable: false, isSmall: !this.isLtMd, isCentered: !this.isLtMd },
    { field: null, title: !this.isLtMd && 'Открыть', width: null, isSortable: false, isSmall: this.isMd, isMedium: this.isGtMd, isCentered: !this.isLtMd, isSticky: this.isStickyRight }, // btn column
  ]}
  /** returns an Array (value, index) where
   * value = index of longestCell of each field, index = index of ield in fieldsList
  */
  get longestFields() {
    return [...this.fields].map((field, fieldIndex) => {
      const values = this.list.map(item => item[field.field])

      let maxIndex = 0
      values.forEach((value, valueIndex) => {
        if (typeof value === 'boolean' || !value) return

        const currentLength = value.toString().length
        if (currentLength > values[maxIndex].toString().length) maxIndex = valueIndex
      })

      return maxIndex
    })
  }
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
  get isHorizontalOverscroll() { return this.horizontalOverscroll > 50 && !this.isLtMd }

  @Watch('breakpoint')
  async onBreakpointChange() {
    this.destroyTableScroll()
    this.isStickyLeft = false
    this.isStickyRight = false

    if (this.isLtMd) return

    await this.$nextTick()
    this.checkTableOverscroll()
    if (this.isHorizontalOverscroll) this.initHorizontalScroll()
  }
  @Watch('list', { immediate: true })
  async onListChange() {
    console.log('list update')
    await this.$nextTick()
    this.updateFieldsWidth()

    this.destroyTableScroll()
    this.isStickyLeft = false
    this.isStickyRight = false

    if (this.isLtMd) return
    // await sleep(3000)

    await this.$nextTick()
    this.checkTableOverscroll()
    if (this.isHorizontalOverscroll) this.initHorizontalScroll()
  }

  // HOOKS
  async mounted() {
    if (this.isLtMd) return
    await this.$nextTick()
    this.updateFieldsWidth()
    await this.$nextTick()
    // await sleep(3000)
    this.checkTableOverscroll()
    if (this.isHorizontalOverscroll) this.initHorizontalScroll()
  }
  beforeDestroy() {
    if (this.isHorizontalOverscroll) this.destroyTableScroll()
  }

  //METHODS
  setCellStyle(index) {
    const width = this.maxWidths[index]

    if (index === 1) return `left: ${this.maxWidths[0]}px;`
    else return `min-width: ${width}px;`
  }
  updateFieldsWidth() {
    if (!this.tableRef || !this.itemRef) return

    // calculate maxWidths
    this.maxWidths = []

    const tableWidth = this.tableRef.offsetWidth
    const itemsRefs = Array.from(this.itemRef)
    this.longestFields.forEach((longestCellIndex, fieldIndex) => {
      if (fieldIndex === 1) {
        this.maxWidths.push(null)
        return
      }

      const cells = Array.from(itemsRefs[longestCellIndex].$el.querySelectorAll('.table-cell'))
      const cell = cells[fieldIndex] as HTMLElement
      cell.style.width = 'auto'
      cell.style.flex = '1 0 auto'
      console.log(cell, cell.offsetWidth + 5)
      const maxWidth = Math.ceil(cell.offsetWidth) + 5
      this.maxWidths.push(maxWidth)
      cell.style.width = null
      cell.style.flex = null
    })

    console.log(this.maxWidths)
  }
  // HORIZONTAL SCROLL METHODS
  updateSticky() {
    if (!this.tableRef) return

    this.isStickyLeft = Math.floor(this.tableRef.scrollLeft) > 0
    this.isStickyRight = Math.ceil(this.tableRef.scrollLeft) < this.horizontalOverscroll
  }
  checkTableOverscroll() {
    if (!this.tableRef || !this.titleRef) return

    const tableWidth = this.tableRef.offsetWidth
    let cellsWidth = 0
    this.titleRef.forEach((el) => cellsWidth += el.offsetWidth)
    this.horizontalOverscroll = cellsWidth - tableWidth
    console.log(this.horizontalOverscroll)
  }
  destroyTableScroll() {
    if (!this.tableRef) return

    this.tableRef.removeEventListener('mousedown', this.startDrag);
    this.tableRef.removeEventListener('mousemove', this.progressDrag);
    this.tableRef.removeEventListener('mousewheel', this.updateSticky)
    this.tableRef.removeEventListener('mouseleave', this.finishDrag);
    this.tableRef.removeEventListener('mouseup', this.finishDrag);
  }
  initHorizontalScroll() {
    if (!this.tableRef) return

    this.tableRef.addEventListener('mousedown', (evt) => this.startDrag(evt));
    this.tableRef.addEventListener('mousemove', (evt) => this.progressDrag(evt));
    this.tableRef.addEventListener('mousewheel', this.updateSticky)
    this.tableRef.addEventListener('mouseleave', () => this.finishDrag());
    this.tableRef.addEventListener('mouseup', () => this.finishDrag());
    this.updateSticky()
  }
  startDrag(evt) {
    this.mouseIsDown = true;
    this.startX = evt.pageX - this.tableRef.offsetLeft;
    this.scrollLeft = this.tableRef.scrollLeft;
  }
  progressDrag(evt) {
    if (!this.mouseIsDown) return

    evt.preventDefault()
    const x = evt.pageX - this.tableRef.offsetLeft
    const walk = (x - this.startX) * 3
    this.tableRef.scrollLeft = this.scrollLeft - walk
    this.updateSticky()
  }
  finishDrag() {
    this.mouseIsDown = false;
    this.updateSticky()
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
    flex-grow 1
    margin-top 10px

  &__table
    // margin-bottom 50px
    width 100%
    &.is-horiz-scrolled
      overflow-x scroll
      cursor grab

  &__sort
    margin-bottom 50px

  &__title
    position relative
    fontMedium()
    &:first-letter
      text-transform uppercase

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
    display flex
    flex-grow 1
</style>