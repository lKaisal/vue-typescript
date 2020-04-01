<template lang="pug">
  include ../tools/bemto.pug

  +b.filter-app
    +e.container
      +e.item(v-for="(item, index) in filterItems")
        +e.title
          +e.title-content(v-html="item.title")
          +e.I.el-icon.el-icon-arrow-right
        +e.subitems
          +e.subitem(v-for="(value, index) in item.values")
            +e.checkbox.checkbox
              +e.checkbox-icon-wrapper.checkbox-icon-wrapper
                +e.I.checkbox-icon.el-icon-check.checkbox-icon
              +e.checkbox-label(v-html="value")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { FilterItem } from '@/models'

@Component({
  components: {
  }
})

export default class SearchApp extends Vue {
  @Prop() list: Object[]
  @Prop() filterItems: FilterItem[]

  activeItems: string[] = []

  created() {
    if (!this.filterItems || !this.filterItems.length) return 
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.filter-app

  &__row
    display flex
    +xs()
      flex-wrap wrap

  &__title
    display flex
    align-items center
    margin-bottom 7px
    fontMedium()

  &__subitems
    display flex
    flex-wrap wrap

  &__subitem
    &:not(:last-child)
      margin-right 15px
      margin-bottom 15px

  &__checkbox-label
    margin-left 5px

  &__select
    grid-size(4, 1, 1.1, 1.1, 1.25)
    min-width 175px

  &__input
    grid-size(4, 1.5, 2, 2, 2.4)
    min-width 200px
    +gt-sm()
      margin-right 10px
    +xs()
      margin-bottom 10px

  &__select
  &__input
    >>> input
      fontMedium()
      transition(border-color)
      width-between-property 'font-size' 1001 12 1440 14 true true
    &.is-filled
      >>> input
        border-color $cBrand
    >>> .el-icon-circle-close
      cursor pointer
</style>