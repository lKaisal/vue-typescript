<template lang="pug">
  include ../../../../tools/bemto.pug

  +b.subitems-filter
    +e.container
      +e.row
        +e.subitem(v-for="(value, index) in values")
          +e.checkbox.checkbox(@click="onSubitemClick(index)" :class="{ 'is-active': getSubitemIsActive(index) }")
            +e.checkbox-icon-wrapper.checkbox-icon-wrapper
              +e.I.checkbox-icon.el-icon-check.checkbox-icon
            +e.checkbox-label(v-html="value")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { FilterItem } from '@/models'
import ButtonApp from '@/components/ButtonApp.vue'

@Component({
  components: {
    ButtonApp
  }
})

export default class SubitemsFilter extends Vue {
  @Prop() values: FilterItem['values']
  @Prop() selected: number[]

  iconInactive: string = 'el-icon-arrow-right'
  iconActive: string = 'el-icon-arrow-down'

  get smthIsSelected() { return this.selected.length }

  onSubitemClick(index) {
    this.$emit('clicked', index)
  }
  getSubitemIsActive(index) {
    return this.selected.indexOf(index) >= 0
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../styles/tools'

.subitems-filter

  &__row
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