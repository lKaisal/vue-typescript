<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-sections
    +e.container(v-if="listActive && listActive.length")
      +e.H3.status-title Активные

      +e.table
        //- table head
        +e.row.table-row
          +e.title.table-cell.col-05
            +e.checkbox.checkbox-sections(@click="onSelectAllClick" :class="{ 'is-active': allAreSelected }")
              +e.I.checkbox-icon.el-icon-check
          +e.title.table-cell.col-2(v-for="(title, index) in titles")
            +e.title-wrapper(@click="onTitleClick(index)")
              +e.title-text(v-html="title")
              +e.title-sort(v-if="index < titles.length - 1")
                +e.I.title-sort-icon.el-icon-caret-top(:class="{ 'is-active': listSortBy === fields[index] && listSortDirection === 'asc' }")
                +e.I.title-sort-icon.el-icon-caret-bottom(:class="{ 'is-active': listSortBy === fields[index] && listSortDirection === 'desc' }")
        //- table body
        ItemSections(v-for="(item, index) in listActive" :key="index" :section="item" :isActive="indexesSelected.indexOf(index) >= 0" @checkboxClicked="onItemCheckboxClick(index)"
          class="list-sections__item table-row")

      ButtonApp(text="Деактивировать" btnType="warning" class="list-sections__btn")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { sectionsMapper } from '../module/store'
import ItemSections from '../components/ItemSections.vue'
import ButtonApp from '@/components/ButtonApp.vue'
import { Section, ListSort } from '../models'

const Mappers = Vue.extend({
  computed: {
    ...sectionsMapper.mapState(['list', 'listSort']),
    ...sectionsMapper.mapGetters(['listActive', 'listInactive'])
  },
  methods: {
    ...sectionsMapper.mapMutations(['updateListSort'])
  }
})

@Component({
  components: {
    ItemSections,
    ButtonApp
  }
})

export default class ListSections extends Mappers {
  titles: string[] = [ 'Название', 'Дата обновления', 'Дата создания', 'Статус' ]
  fields: (keyof Section)[] = [ 'feature', 'updatedAt', 'createdAt' ]
  checkboxIsActive: boolean = false
  indexesSelected: number[] = []

  get amountTotal() { return this.listActive && this.listActive.length }
  get allAreSelected() { return this.amountTotal === this.indexesSelected.length }
  get allIndexes() { return this.listActive && this.listActive.map((item, index) => index) }
  get listSortBy() { return this.listSort.by }
  get listSortDirection() { return this.listSort.direction }

  onSelectAllClick() {
    if (this.allAreSelected) this.indexesSelected = []
    else this.indexesSelected = [...this.allIndexes]
  }
  onItemCheckboxClick(index) {
    const indexInSelected = this.indexesSelected.indexOf(index)
    const isSelected = indexInSelected >= 0

    if (isSelected) this.indexesSelected.splice(indexInSelected, 1)
    else this.indexesSelected.push(index)
  }
  onTitleClick(index) {
    const by: ListSort['by'] = this.fields[index]
    const byIsUpdated = by !== this.listSortBy
    const direction: ListSort['direction'] = (byIsUpdated || this.listSortDirection === 'desc') ? 'asc' : 'desc'

    const listSort: ListSort = { by, direction }
    this.updateListSort(listSort)
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../common'

.list-sections

  &__container
    width 100%
    &:not(:last-child)
      margin-bottom 100px

  &__row
    display flex
    padding 10px 0

  &__table
    margin-bottom 50px
    width 100%

  &__status-title
    margin-bottom 25px

  &__status-title
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
    .list-sections__title.col-2:nth-of-type(2) &
    .list-sections__title.col-2:nth-of-type(3) &
    .list-sections__title.col-2:nth-of-type(4) &
      cursor pointer
      &:hover
        opacity .75

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
    &:nth-of-type(2n + 1)
      background-color $cDisabled
</style>