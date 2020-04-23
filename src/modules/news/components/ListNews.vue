<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-news
    +e.container
      +e.table.is-long-list
        //- table head
        +e.row.table-row.table-head(v-if="!isLtMd")
          +e.title.table-cell(v-for="(field, index) in fields"
            :class=`[{ 'is-sticky': field.isSticky && isHorizontalOverscroll, 'col-075': field.isSmall, 'col-1': field.isMedium,
              'col-15': field.isXMedium, 'col-2': field.isLarge, 'col-3': field.isXLarge, 'is-centered': field.isCentered }]`)
            TitleTable(:title="field.title" :isSortable="field.isSortable && !!list && !!list.length"
              :isAscSorted="listSortField === fields[index].field && isAscSorted"
              :isDescSorted="listSortField === fields[index].field && isDescSorted"
              @titleClicked="field.isSortable && onTitleClick(index)")
        //- table body
        ItemNews(v-for="(item, index) in list" :key="index" :titleIsShown="isLtMd" :news="item" :fields="fields"
          @clicked="onItemClick(item)" ref="itemRef"
          class="list-news__item table-row")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch, Ref } from 'vue-property-decorator'
import { newsMapper } from '../module/store'
// import ItemNews from '../components/ItemNews.vue'
import ButtonApp from '@/components/ButtonApp.vue'
import { News, ListSort, TableField } from '../models'
import MsgBoxTools from '../mixins/MsgBoxTools'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MessageBox from '@/components/MessageBox.vue'
import { mapState } from 'vuex'
import { uiMapper } from '@/services/store/modules/ui/store'
import sleep from '@/mixins/sleep'
import TitleTable from '@/components/table/TitleTable.vue'
import ItemNews from '../components/ItemNews.vue'

const UiMappers = Vue.extend({
  computed: {
    ...uiMapper.mapState(['breakpoint'])
  }
})

const NewsMappers = Vue.extend({
  computed: {
    ...newsMapper.mapState(['listSort']),
  },
  methods: {
    ...newsMapper.mapMutations(['updateListSort'])
  }
})

@Component({
  components: {
    ItemNews,
    TitleTable,
    ButtonApp,
    MessageBox
  },
})

export default class ListNews extends Mixins(NewsMappers, UiMappers, MsgBoxToolsApp, MsgBoxTools) {
  @Prop() list: News[]
  breakpoint!: string

  get fields(): TableField[] { return [
    { field: 'id', title: 'ID', isSortable: true, isSmall: this.isLg || this.isMd, isMedium: this.isXl, isCentered: !this.isLtMd },
    { field: 'header', title: 'Заголовок новости', isSortable: true, isXLarge: true },
    { field: 'created_at', title: 'Дата создания', isSortable: true, isXMedium: true, isCentered: !this.isLtMd },
    { field: 'updated_at', title: 'Дата обновления', isSortable: true, isXMedium: true, isCentered: !this.isLtMd },
    { field: 'published', title: 'Новость опубликована<br>в&nbsp;веб&#8209;версии&nbsp;/&nbsp;в&nbsp;приложении', isLarge: true, isCentered: !this.isLtMd },
    { field: null, title: !this.isLtMd && 'Открыть', isMedium: true, isCentered: !this.isLtMd }, // btn column
  ]}
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

  // SORT METHODS (TABLE HEAD)
  onTitleClick(index) {
    const by: ListSort['by'] = this.fields.map(f => f.field)[index]
    const byIsUpdated = by !== this.listSortField
    const direction: ListSort['direction'] = (byIsUpdated || this.listSortDirection === 'desc') ? 'asc' : 'desc'

    const listSort: ListSort = { by, direction }
    this.updateListSort(listSort)
  }
  resetSort() {
    const listSort: ListSort = { by: 'updated_at', direction: 'desc' }
    this.updateListSort(listSort)
  }
  // ITEMS METHODS
  onItemClick(item: News) {
    // this.$emit('itemClicked', item.userId)
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../common'

.list-news

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