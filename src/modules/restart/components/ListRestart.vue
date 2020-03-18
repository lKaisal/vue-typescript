<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-restart
    +e.container
      +e.table(:class="{ 'is-long-list': list.length > 2 }")
        //- table head
        +e.row.table-row
          //- +e.title.table-cell.col-05
          +e.title.table-cell(v-for="(field, index) in fields"
            :class="{ 'col-05': field.isSmall, 'col-1': field.isMedium, 'col-2': !field.isSmall && !field.isMedium }")
            +e.checkbox.checkbox(v-if="index === 0" @click="onSelectAllClick()" :class="{ 'is-active': allAreSelected, 'is-disabled': !list.length }")
              +e.checkbox-icon-wrapper.checkbox-icon-wrapper
                +e.I.checkbox-icon.el-icon-check.checkbox-icon
            +e.title-wrapper(v-else @click="onTitleClick(index)" :class="{ 'is-disabled': !list.length }")
              +e.title-text(v-html="field.title")
              +e.title-sort
                +e.I.title-sort-icon.el-icon-caret-top(:class="{ 'is-active': listSortField === fields[index].field && isAscSorted }")
                +e.I.title-sort-icon.el-icon-caret-bottom(:class="{ 'is-active': listSortField === fields[index].field && isDescSorted }")
        //- table body
        ItemRestart(v-for="(item, index) in list" :key="index" :section="item" :fields="fields" :isActive="namesSelected.indexOf(item.serviceName) >= 0" @checkboxClicked="onItemCheckboxClick(item.serviceName)"
          class="list-restart__item table-row")

      +e.btns
        ButtonApp(v-show="list.length" text="Перезапустить" :isDisabled="!namesSelected.length" @clicked="onRestartClick" class="list-restart__btn")
        ButtonApp(text="Обновить список" btnType="primaryText" @clicked="onUpdateClick" class="list-restart__btn")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { restartMapper } from '../module/store'
import ItemRestart from '../components/ItemRestart.vue'
import ButtonApp from '@/components/ButtonApp.vue'
import { Service, ListSort, EditPayload } from '../models'
import MsgBoxTools from '../mixins/MsgBoxTools'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MessageBox from '@/components/MessageBox.vue'
import { TableField } from '../models'
import { mapState } from 'vuex'
// import { rootMapper } from '@/modules/system/module/store'

const RootMappers = Vue.extend({
  // computed: {
  //   ...rootMapper.mapState(['breakpoint'])
  // }
})

const RestartMappers = Vue.extend({
  computed: {
    ...restartMapper.mapState(['listSort']),
  },
  methods: {
    ...restartMapper.mapMutations(['updateListSort']),
    ...restartMapper.mapActions(['editList'])
  }
})

@Component({
  components: {
    ItemRestart,
    ButtonApp,
    MessageBox
  },
})

export default class ListRestart extends Mixins(RootMappers, RestartMappers, MsgBoxToolsApp, MsgBoxTools) {
  @Prop() list: Service[]
  checkboxIsActive: boolean = false
  namesSelected: string[] = []

  get fields(): TableField[] { return [
    { field: null, title: '', isSmall: true }, // checkbox column
    { field: 'serviceName', title: 'Название' },
    { field: 'replicas', title: (this.isXs ? 'Кол-во реплик' : 'Количество реплик'), isMedium: true },
  ]}
  get isXs() { return this.breakpoint === 'xs' }
  get amountTotal() { return this.list && this.list.length }
  get allAreSelected() { return this.namesSelected.length > 0 && this.amountTotal === this.namesSelected.length }
  get allNames() { return this.list && this.list.map(item => item.serviceName) }
  get listSortField() { return this.listSort.by }
  get listSortDirection() { return this.listSort.direction }
  get isAscSorted() { return this.listSortDirection === 'asc' }
  get isDescSorted() { return this.listSortDirection === 'desc' }

  @Watch('isActive', { immediate: true })
  onIsActiveChange(val) {
    this.resetSelect()
    this.resetSort()
  }

  // SELECT METHODS (CHECKBOX)
  onSelectAllClick() {
    if (this.allAreSelected) this.namesSelected = []
    else this.namesSelected = [...this.allNames]
  }
  onItemCheckboxClick(id) {
    const indexInSelected = this.namesSelected.indexOf(id)
    const isSelected = indexInSelected >= 0

    if (isSelected) this.namesSelected.splice(indexInSelected, 1)
    else this.namesSelected.push(id)
  }
  resetSelect() {
    this.namesSelected = []
    this.checkboxIsActive = false
  }
  // SORT METHODS (TABLE HEAD)
  onTitleClick(index) {
    const by: ListSort['by'] = this.fields[index].field
    const byIsUpdated = by !== this.listSortField
    const direction: ListSort['direction'] = (byIsUpdated || this.listSortDirection === 'desc') ? 'asc' : 'desc'

    const listSort: ListSort = { by, direction }
    this.updateListSort(listSort)
  }
  resetSort() {
    const listSort: ListSort = { by: 'serviceName', direction: 'asc' }
    this.updateListSort(listSort)
  }
  // SUBMIT METHOD
  onRestartClick() {
    const payload: EditPayload = []
    for (const serviceName of this.namesSelected) payload.push({ serviceName })

    this.$emit('editClicked', payload)
  }
  onUpdateClick() {
    this.$emit('updateClicked')
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../common'

.list-restart

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
    &:nth-of-type(2)
      flex-grow 1
    +gt-sm()
      white-space nowrap

  &__title-wrapper
    display flex
    align-items center
    padding 10px
    margin -10px
    transition(opacity)
    .list-restart__title:not(:first-child) &
      cursor pointer
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

  &__btns
    display flex

  &__btn
    &:not(:last-child)
      margin-right 10px
</style>