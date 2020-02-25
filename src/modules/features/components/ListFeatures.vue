<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-features
    +e.container(v-if="list.data && list.data.length")
      +e.EL-MENU.sort(:default-active="(activeHashIndex + 1).toString()" mode="horizontal" @select="handleMenuClick")
        +e.EL-MENU-ITEM.sort-item(v-for="(item, index) in sortItems" :key="index" :index="(index + 1).toString()" v-html="item")

      transition(mode="out-in")
        +e.container(:key="activeHashIndex")
          +e.table(:class="{ 'is-long-list': currentList.length > 2 }")
            //- table head
            +e.row.table-row
              +e.title.table-cell.col-05
                +e.checkbox.checkbox-features(@click="onSelectAllClick()" :class="{ 'is-active': allAreSelected, 'is-disabled': !currentList.length }")
                  +e.I.checkbox-icon.el-icon-check
              +e.title.table-cell.col-2(v-for="(title, index) in titles")
                +e.title-wrapper(@click="onTitleClick(index)" :class="{ 'is-disabled': !currentList.length }")
                  +e.title-text(v-html="title")
                  +e.title-sort(v-if="index < titles.length - 1")
                    +e.I.title-sort-icon.el-icon-caret-top(:class="{ 'is-active': listSortBy === fields[index] && listSortDirection === 'asc' }")
                    +e.I.title-sort-icon.el-icon-caret-bottom(:class="{ 'is-active': listSortBy === fields[index] && listSortDirection === 'desc' }")
            //- table body
            ItemFeatures(v-for="(item, index) in currentList" :key="index" :section="item" :isActive="idsSelected.indexOf(item.id) >= 0" @checkboxClicked="onItemCheckboxClick(item.id)"
              class="list-features__item table-row")

          ButtonApp(v-if="currentList.length" :key="currentList.length" :text="btnText" :btnType="btnType" :isDisabled="!idsSelected.length" @clicked="onBtnClick" class="list-features__btn")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { featuresMapper } from '../module/store'
import ItemFeatures from '../components/ItemFeatures.vue'
import ButtonApp from '@/components/ButtonApp.vue'
import { Section, ListSort, EditPayload } from '../models'

const Mappers = Vue.extend({
  computed: {
    ...featuresMapper.mapState(['list', 'listSort', 'hashes']),
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
    ButtonApp
  }
})

export default class ListFeatures extends Mappers {
  titles: string[] = [ 'Название', 'Дата обновления', 'Дата создания', 'Статус' ]
  fields: (keyof Section)[] = [ 'feature', 'updatedAt', 'createdAt' ]
  checkboxIsActive: boolean = false
  idsSelected: number[] = []

  get tabs() {
    return [
      { hash: this.hashes[0], list: this.listActive, sort: `Активные (${this.listActive.length})` },
      { hash: this.hashes[1], list: this.listInactive, sort: `Неактивные (${this.listInactive.length})` },
    ]
  }
  get activeHash() { return this.$route.hash }
  // @ts-ignore
  get activeHashIndex() { return this.activeHash && this.hashes.indexOf(this.activeHash.slice(1)) || 0 }
  get currentList() { return this.tabs[this.activeHashIndex].list }
  get sortItems() { return this.tabs.map(item => item.sort) }
  get amountTotal() { return this.currentList && this.currentList.length }
  get allAreSelected() { return this.idsSelected.length > 0 && this.amountTotal === this.idsSelected.length }
  get allIds() { return this.currentList && this.currentList.map(item => item.id) }
  get listSortBy() { return this.listSort.by }
  get listSortDirection() { return this.listSort.direction }
  get btnText() { return this.activeHashIndex === 0 ? 'Деактивировать' : 'Активировать' }
  get btnType() { return this.activeHashIndex === 0 ? 'warning' : 'success' }

  handleMenuClick(index) {
    this.$router.push({path: this.$route.path, hash: `#${this.hashes[index - 1]}` }).catch(err => {})
    this.resetSelect()
    this.resetSort()
  }
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
  onBtnClick() {
    const payload: EditPayload = []
    for (const id of this.idsSelected) payload.push({id, active: this.activeHashIndex === 1})

    this.editList(payload)
      .then(() => {
        this.resetSelect()
        if (!this.currentList.length) {
          const hashIndex = this.activeHashIndex === 0 ? 2 : 1
          this.handleMenuClick(hashIndex)
        }
      })
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