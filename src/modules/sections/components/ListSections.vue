<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-sections
    +e.container(v-if="listActive && listActive.length")
      +e.H3.title Активные
      +e.table
        +e.row.table-row
          +e.title.table-cell.col-1
            +e.checkbox.checkbox-sections(@click="onSelectAllClick" :class="{ 'is-active': allAreSelected }")
              +e.I.checkbox-icon.el-icon-check
          +e.title.table-cell.col-2(v-for="(title, index) in titles" v-html="title")
        ItemSections(v-for="(item, index) in listActive" :key="index" :section="item" :isActive="indexesSelected.indexOf(index) >= 0" @checkboxClicked="onItemCheckboxClick(index)"
          class="list-sections__item table-row")
      ButtonApp(text="Деактивировать" btnType="warning" class="list-sections__btn")
    +e.container(v-if="listInactive && listInactive.length")
      +e.H3.title Неактивные
      +e.row.table-row
        +e.title.table-cell(v-for="(title, index) in titles" v-html="title" :class="index > 0 ? 'col-2' : 'col-1'")
      ItemSections(v-for="(item, index) in listInactive" :key="index" :section="item" class="list-sections__item table-row")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { sectionsMapper } from '../module/store'
import ItemSections from '../components/ItemSections.vue'
import ButtonApp from '@/components/ButtonApp.vue'

const Mappers = Vue.extend({
  computed: {
    ...sectionsMapper.mapState(['list']),
    ...sectionsMapper.mapGetters(['listActive', 'listInactive'])
  }
})

@Component({
  components: {
    ItemSections,
    ButtonApp
  }
})

export default class ListSections extends Mappers {
  titles: string[] = [ 'feature', 'updatedAt', 'createdAt', 'Статус' ]
  checkboxIsActive: boolean = false
  indexesSelected: number[] = []

  get amountTotal() { return this.listActive && this.listActive.length }
  get allAreSelected() { return this.amountTotal === this.indexesSelected.length }
  get allIndexes() { return this.listActive && this.listActive.map((item, index) => index) }

  onSelectAllClick() {
    if (this.allAreSelected) this.indexesSelected = []
    else this.indexesSelected = [...this.allIndexes]
  }
  onItemCheckboxClick(index) {
    const indexInSelected = this.indexesSelected.indexOf(index)
    const isSelected = indexInSelected >= 0

    if (isSelected) this.indexesSelected.splice(index, 1)
    else this.indexesSelected.push(index)
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

  &__table
    margin-bottom 50px
    width 100%

  &__title
    color $cSecondaryText
    fontMedium()
    &:first-letter
      text-transform capitalize
</style>