<template lang="pug">
  include ../../../../tools/bemto.pug

  +b.item-filter
    +e.container
      +e.row
        +e.title(@click="toggleSubitems")
          +e.title-content(v-html="item.title")
          +e.I.title-icon(:class="this.currentIcon")
        +e.reset(:class="{ 'is-inactive': !smthIsSelected }" @click="resetFilter")
          +e.reset-content Сбросить
      transition
        +e.subitems(v-if="subitemsAreShown")
          +e.subitem(v-for="(value, index) in availableValues")
            +e.checkbox.checkbox(@click="onSubitemClick(value)" :class="{ 'is-active': getSubitemIsActive(value) }")
              +e.checkbox-icon-wrapper.checkbox-icon-wrapper
                +e.I.checkbox-icon.el-icon-check.checkbox-icon
              +e.checkbox-label(v-html="value")
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
  get availableValues() { return this.item.valuesTotal.filter((val, index) => this.availableFields(this.item.field)[index]) }

  toggleSubitems() {
    this.subitemsAreShown = !this.subitemsAreShown
  }
  onSubitemClick(value) {
    this.updateFilterSelected({field: this.item.field, value: value})
  }
  getSubitemIsActive(value) {
    return this.item.valuesSelected.indexOf(value) >= 0
  }
  resetFilter() {
    this.clearFilterSelected(this.item.field)
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../styles/tools'

.item-filter

  &__row
    display flex
    align-items center
    margin-bottom 15px

  &__title
    padding 5px
    margin -5px
    display flex
    align-items center
    fontMedium()
    cursor pointer
    transition(opacity)
    &:hover
      opacity .75

  &__title-icon
    margin-left 5px

  &__reset
    padding 5px
    margin -5px
    margin-left 15px
    color $cBrand
    font-size 12px
    cursor pointer
    transition(opacity)
    &:hover
      opacity .75
    &.is-inactive
      opacity 0
      pointer-events none

  &__subitems
    display flex
    flex-wrap wrap

  &__subitem
    margin-bottom 15px
    &:not(:last-child)
      margin-right 15px
    &.is-disabled
      opacity .5

  &__checkbox-label
    margin-left 5px
</style>