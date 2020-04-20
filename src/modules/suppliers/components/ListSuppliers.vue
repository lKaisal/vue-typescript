<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-suppliers
    +e.container
      +e.table(ref="tableRef" :class="{ 'is-horiz-scrolled': isHorizontalOverscroll }")
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
        ItemSuppliers(v-for="(item, index) in list" :key="index" :titleIsShown="isLtMd" :supplier="item" :fields="fields" :widths="minWidths"
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
import { uiMapper } from '@/services/store/modules/ui/store'
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
  // columns width variables
  minWidths: number[] = []
  cells: (HTMLElement[])[] = []
  // horizScroll variables
  horizontalOverscroll: number = 0
  mouseIsDown: boolean = false
  startX: number = null
  scrollLeft: number = null
  isStickyLeft: boolean = false
  isStickyRight: boolean = false

  get fields(): TableField[] { return [
    { field: 'supplierId', title: 'SupplierID', isWidthCalculable: true, isSortable: true, isSmall: this.isLg || this.isMd, isMedium: this.isXl, isCentered: true },
    { field: 'supplierName', title: 'Название поставщика', isSortable: true, isXLarge: true, isSticky: this.isStickyLeft },
    { field: 'createdAt', title: 'Дата регистрации', isWidthCalculable: true, isSortable: true, isMedium: true, isCentered: true },
    { field: 'contractsNames', title: 'Тип договора', isSortable: true, isLarge: true, isCentered: true },
    { field: 'userId', title: 'UserID', isWidthCalculable: true, isSortable: true, isSmall: this.isMd, isMedium: this.isGtMd, isCentered: true },
    { field: 'userName', title: 'Имя пользователя', isSortable: true, isWidthCalculable: true, isMedium: true, isCentered: true },
    { field: 'inn', title: 'ИНН', isWidthCalculable: true, isSortable: true, isSmall: this.isMd, isMedium: this.isGtMd, isCentered: true },
    { field: 'phone', title: 'Телефон', isWidthCalculable: true, isSortable: true, isSmall: false, isMedium: this.isLg || this.isMd, isXMedium: this.isXl, isCentered: true },
    { field: 'confirmed', title: 'Статус пользователя', isSortable: false, isSmall: this.isMd, isMedium: !this.isMd, isCentered: true },
    { field: null, title: !this.isLtMd && 'Открыть', isSortable: false, isSmall: this.isMd, isMedium: this.isGtMd, isCentered: true, isSticky: this.isStickyRight }, // btn column
  ]}
  get isHorizontalOverscroll() { return this.horizontalOverscroll > 20 && !this.isLtMd }
  // COLUMNS WIDTHS GETTERS
  get minWidthsCoeff() { return this.minWidths.length && this.minWidths.reduce((acc, curr, index) => acc += curr * index) }
  /** returns an Array (value, index) where
   * value = index of longestCell of each field, index = index of field in fieldsList
  */
  get longestFields() {
    if (!this.list || !this.list.length) return

    return [...this.fields].map((field, fieldIndex) => {
      const values = this.list.map(item => item[field.field])

      let maxIndex = 0

      if (field.isWidthCalculable) {
        values.forEach((value, valueIndex) => {
          if (typeof value === 'boolean' || !value) return

          const currentLength = value.toString().length
          if (currentLength > values[maxIndex].toString().length) maxIndex = valueIndex
        })
      } else {
        maxIndex = null
      }

      return maxIndex
    })
  }
  // BREAKPOINTS GETTERS
  get isGtMd() { return this.breakpoint === 'xl' || this.breakpoint === 'lg' }
  get isLtMd() { return this.breakpoint === 'xs' || this.breakpoint === 'sm' }
  get isXl() { return this.breakpoint === 'xl' }
  get isLg() { return this.breakpoint === 'lg' }
  get isMd() { return this.breakpoint === 'md' }
  // LIST GETTERS
  get amountTotal() { return this.list && this.list.length }
  get listSortField() { return this.listSort.by }
  get listSortDirection() { return this.listSort.direction }
  get isAscSorted() { return this.listSortDirection === 'asc' }
  get isDescSorted() { return this.listSortDirection === 'desc' }

  @Watch('breakpoint')
  async onBreakpointChange() {
    this.destroyTableScroll()
    this.clearFieldsWidth()

    if (this.isLtMd) return

    await this.$nextTick()
    this.updateFieldsWidth()

    await this.$nextTick()
    this.checkTableOverscroll()
    if (this.isHorizontalOverscroll) this.initHorizontalScroll()
  }
  @Watch('list', { immediate: true })
  async onListChange() {
    this.destroyTableScroll()
    this.clearFieldsWidth()

    if (this.isLtMd) return

    await this.$nextTick()
    this.updateFieldsWidth()

    await this.$nextTick()
    this.checkTableOverscroll()
    if (this.isHorizontalOverscroll) this.initHorizontalScroll()
  }

  // TODO: при обновлении списка не затирается фильтр по поиску

  // HOOKS
  async mounted() {
    if (this.isLtMd) return

    this.destroyTableScroll()
    this.clearFieldsWidth()

    await this.$nextTick()
    this.updateFieldsWidth()

    await this.$nextTick()
    this.checkTableOverscroll()
    if (this.isHorizontalOverscroll) this.initHorizontalScroll()
  }
  beforeDestroy() {
    if (this.isHorizontalOverscroll) this.destroyTableScroll()
  }

  // COLUMNS WIDTH METHODS
  setCellStyle(index) {
    const width = this.minWidths[index]

    if (index === 1) return `left: ${this.minWidths[0]}px;`
    else return `min-width: ${width}px;`
  }
  clearFieldsWidth() {
    this.minWidths = []
    this.cells = []
  }
  updateFieldsWidth() {
    if (!this.tableRef || !this.itemRef || !this.longestFields || !this.longestFields.length) return

    // calculate minWidths
    const tableWidth = this.tableRef.offsetWidth
    const itemsRefs = Array.from(this.itemRef)
    this.minWidths = []
    this.cells = []
    this.longestFields.forEach((longestCellIndex, fieldIndex) => {

      // case: !field.isWidthCalculable
      if (typeof longestCellIndex !== 'number') {
        this.minWidths.push(null)
        return
      }

      // case: field.isWidthCalculable
      let cells = this.cells[longestCellIndex]

      if (!cells) {
        cells = Array.from(itemsRefs[longestCellIndex].$el.querySelectorAll('.table-cell'))
        this.cells[longestCellIndex] = cells
      }

      const cell = cells[fieldIndex] as HTMLElement
      cell.setAttribute('style', 'width: auto; min-width: none; flex: 1 0 auto;')
      // cell.style.width = 'auto'
      // cell.style.minWidth = 'none'
      // cell.style.flex = '1 0 auto'
      const minWidth = Math.ceil(cell.offsetWidth) + 10
      this.minWidths.push(minWidth)
      cell.setAttribute('style', '')
    })
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
  }
  destroyTableScroll() {
    if (!this.tableRef) return

    this.isStickyLeft = false
    this.isStickyRight = false

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