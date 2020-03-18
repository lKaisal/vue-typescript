<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-features
    +e.container
      +e.table(:class="{ 'is-long-list': list.length > 2 }")
        //- table head
        +e.row.table-row
          +e.title.table-cell(v-for="(field, index) in fieldsShown"
            :class="{ 'col-05': field.isSmall, 'col-1': field.isMedium, 'col-2': !field.isSmall && !field.isMedium }")
            +e.checkbox.checkbox(v-if="index === 0" @click="onSelectAllClick()" :class="{ 'is-active': allAreSelected, 'is-disabled': !list.length }")
              +e.checkbox-icon-wrapper.checkbox-icon-wrapper
                +e.I.checkbox-icon.el-icon-check.checkbox-icon
              +e.checkbox-text.checkbox-text(v-if="isXs") Выбрать все
            +e.title-wrapper(v-else-if="!isXs" @click="onTitleClick(index)" :class="{ 'is-disabled': !list.length }")
              +e.title-text(v-html="field.title")
              +e.title-sort(v-if="index < fields.length - 1")
                +e.I.title-sort-icon.el-icon-caret-top(:class="{ 'is-active': listSortField === fields[index].field && listSortDirection === 'asc' }")
                +e.I.title-sort-icon.el-icon-caret-bottom(:class="{ 'is-active': listSortField === fields[index].field && listSortDirection === 'desc' }")
        //- table body
        ItemFeatures(v-for="(item, index) in list" :key="index" :section="item" :fields="fieldsShown" :isActive="idsSelected.indexOf(item.id) >= 0" @checkboxClicked="onItemCheckboxClick(item.id)"
          class="list-features__item table-row")

      ButtonApp(v-if="list.length" :text="btn.text" :btnType="btn.type" :isDisabled="!idsSelected.length" @clicked="onBtnClick" class="list-features__btn")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { featuresMapper } from '../module/store'
import ItemFeatures from '../components/ItemFeatures.vue'
import ButtonApp from '@/components/ButtonApp.vue'
import { Section, ListSort, EditPayload } from '../models'
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

const FeatureMappers = Vue.extend({
  computed: {
    ...featuresMapper.mapState(['listSort', 'hashes']),
    ...featuresMapper.mapGetters(['listActive', 'listInactive'])
  },
  methods: {
    ...featuresMapper.mapMutations(['updateListSort']),
    ...featuresMapper.mapActions(['editList'])
  }
})

@Component({
  components: {
    ItemFeatures,
    ButtonApp,
    MessageBox
  },
})

export default class ListFeatures extends Mixins(RootMappers, FeatureMappers, MsgBoxToolsApp, MsgBoxTools) {
  @Prop() list: Section[]
  @Prop() isActive: boolean

  checkboxIsActive: boolean = false
  idsSelected: number[] = []

  get fields(): TableField[] { return [
    { field: null, title: '', isShown: true, isSmall: !this.isXs }, // checkbox column
    { field: 'feature', isShown: true, title: 'Название' },
    { field: 'updatedAt', isShown: true, title: 'Дата обновления' },
    { field: 'createdAt', isShown: true, title: 'Дата создания' },
    { field: 'active', isShown: !this.isLtMd, title: 'Статус' },
  ]}
  get fieldsShown() { return this.fields.filter(f => f.isShown) }
  get isLtMd() { return this.breakpoint === 'xs' || this.breakpoint === 'sm' }
  get isXs() { return this.breakpoint === 'xs' }
  get amountTotal() { return this.list && this.list.length }
  get allAreSelected() { return this.idsSelected.length > 0 && this.amountTotal === this.idsSelected.length }
  get allIds() { return this.list && this.list.map(item => item.id) }
  get listSortField() { return this.listSort.by }
  get listSortDirection() { return this.listSort.direction }
  get btn() { return this.isActive ? { text: 'Деактивировать', type: 'warning' } : { text: 'Активировать', type: 'success' } }

  @Watch('isActive', { immediate: true })
  onIsActiveChange(val) {
    this.resetSelect()
    this.resetSort()
  }

  // SELECT METHODS (CHECKBOX)
  onSelectAllClick() {
    if (this.allAreSelected) this.idsSelected = []
    else this.idsSelected = [...this.allIds]
  }
  onItemCheckboxClick(id) {
    const indexInSelected = this.idsSelected.indexOf(id)
    const isSelected = indexInSelected >= 0

    if (isSelected) this.idsSelected.splice(indexInSelected, 1)
    else this.idsSelected.push(id)
  }
  resetSelect() {
    this.idsSelected = []
    this.checkboxIsActive = false
  }
  // SORT METHODS (TABLE HEAD)
  onTitleClick(index) {
    if (index === this.fields.length - 1 && !this.isLtMd) return

    const by: ListSort['by'] = this.fields[index].field
    const byIsUpdated = by !== this.listSortField
    const direction: ListSort['direction'] = (byIsUpdated || this.listSortDirection === 'desc') ? 'asc' : 'desc'

    const listSort: ListSort = { by, direction }
    this.updateListSort(listSort)
  }
  resetSort() {
    const listSort: ListSort = { by: 'id', direction: 'asc' }
    this.updateListSort(listSort)
  }
  // SUBMIT METHOD
  onBtnClick() {
    const payload: EditPayload = []
    for (const id of this.idsSelected) payload.push({ id, active: !this.isActive })

    this.$emit('editClicked', payload)
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../common'

.list-features

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
    width-between-property 'font-size' 601 14 1000 16 true true
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
    .list-features__title.col-2:nth-of-type(2) &
    .list-features__title.col-2:nth-of-type(3) &
    .list-features__title.col-2:nth-of-type(4) &
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
        +lt-lg()
          transform translateY(3px)
      &:last-child
        transform translateY(-4px)
        +lt-lg()
          transform translateY(-3px)
      &.is-active
        color $cBrand

  &__checkbox-text
    margin-left 10px
    white-space nowrap

  &__item
    background-color white
    .is-long-list &
      &:nth-of-type(2n + 1)
        background-color $cDisabled
</style>