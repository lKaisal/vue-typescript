<template lang="pug">
  include ../../../../tools/bemto.pug

  +b.item-filter
    +e.container(:class="{ 'is-expanded': subitemsAreShown }")
      +e.row
        +e.title(@click="toggleSubitems")
          +e.title-content(v-html="item.title")
          +e.I.title-icon.el-icon-arrow-down
        transition
          +e.reset(:class="[{ 'is-inactive': !smthIsSelected }, 'in-title']" @click="resetFilter")
              +e.reset-content Сбросить
      transition
        +e.subitems(v-if="subitemsAreShown")
          +e.subitem(v-for="(value, index) in availableValues")
            +e.checkbox.checkbox(@click="onSubitemClick(value)" :class="{ 'is-active': getSubitemIsActive(value) }")
              +e.checkbox-icon-wrapper.checkbox-icon-wrapper
                +e.I.checkbox-icon.el-icon-check.checkbox-icon
              +e.checkbox-label(v-html="value")
          //- +e.reset(:class="{ 'is-inactive': !smthIsSelected }" @click="resetFilter")
            +e.reset-content Сбросить
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { FilterItem } from '../../models'
import ButtonApp from '@/components/ButtonApp.vue'
import { suppliersMapper } from '../../module/store'

const SuppliersMappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapGetters(['availableFields'])
  },
  methods: {
    ...suppliersMapper.mapMutations(['updateFilterSelected', 'clearFilterSelected']),
  }
})

@Component({
  components: {
    ButtonApp
  }
})

export default class ItemFilter extends Mixins(SuppliersMappers) {
  @Prop() item: FilterItem

  subitemsAreShown: boolean = false
  iconInactive: string = 'el-icon-arrow-right'
  iconActive: string = 'el-icon-arrow-down'

  get smthIsSelected() { return this.item.valuesSelected.length }
  get currentIcon() { return this.subitemsAreShown ? this.iconActive : this.iconInactive }
  get available() { return this.availableFields(this.item.field) }
  get availableValues() { return this.item.valuesTotal.filter((val, index) => this.available[index]) }

  toggleSubitems() {
    this.subitemsAreShown = !this.subitemsAreShown
  }
  onSubitemClick(value) {
    this.updateFilterSelected({field: this.item.field, value: value})
  }
  getSubitemIsActive(value) {
    return this.item.valuesSelected && this.item.valuesSelected.indexOf(value) >= 0
  }
  resetFilter() {
    this.clearFilterSelected(this.item.field)
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../styles/tools'

.item-filter

  &__container
    position relative

  &__row
    // display flex
    // align-items center
    margin-bottom 15px

  &__title
    padding 16px
    // margin -5px
    display flex
    align-items center
    background-color white
    font-size 14px
    fontMedium()
    cursor pointer
    transition(opacity)
    .item-filter__container:not(.is-expanded) &
      &:hover
        opacity .75
    .is-expanded &
      box-shadow 0px 10px 30px 0px rgba(204,204,204,0.5)

  &__title-icon
    margin-left 5px
    transition(transform)
    .is-expanded &
      transform rotateZ(180deg)

  &__reset
    z-index 10
    padding 5px
    margin -5px
    // margin-left 5px
    // margin-bottom 15px
    color $cBrand
    font-size 14px
    cursor pointer
    transition(opacity)
    &:hover
      opacity .75
    &.in-title
      position absolute
      bottom -2.5px
      left 16px
      font-size 13px
    &.is-inactive
      opacity 0
      pointer-events none
    &.v-enter
    &.v-leave-to
      opacity 0

  &__subitems
    z-index 5
    position absolute
    top 100%
    left 0
    min-width 100%
    padding 16px 16px 17px
    // display flex
    // flex-wrap wrap
    background-color white
    box-shadow 0px 16px 30px 0px rgba(204,204,204,0.5)

  &__subitem
    margin-bottom 15px
    &:not(:last-child)
      margin-right 15px
    &.is-disabled
      opacity .5

  &__checkbox
    justify-content flex-start

  &__checkbox-label
    margin-left 5px
</style>