<template lang="pug">
  include ../tools/bemto.pug

  +b.item-filter
    +e.container
      +e.row
        +e.title(@click="toggleSubitems")
          +e.title-content(v-html="item.title")
          +e.I.title-icon(:class="this.currentIcon")
        +e.reset(:class="{ 'is-inactive': !smthIsSelected }" @click="resetFilter")
          +e.reset-content Сбросить
      transition
        +e.subitems-and-button(v-if="subitemsAreShown")
          SubitemsFilter(:values="item.values" :selected="selectedIndexes" @clicked="onSubitemClick" class="item-filter__subitems")
          //- ButtonApp(:isLow="true" :isPlain="true" text="Применить" :isDisabled="!smthIsSelected" class="item-filter__btn")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { FilterItem } from '@/models'
import ButtonApp from '@/components/ButtonApp.vue'
import SubitemsFilter from '@/components/SubitemsFilter.vue'

@Component({
  components: {
    SubitemsFilter,
    ButtonApp
  }
})

export default class ItemFilter extends Vue {
  @Prop() item: FilterItem

  subitemsAreShown: boolean = false
  iconInactive: string = 'el-icon-arrow-right'
  iconActive: string = 'el-icon-arrow-down'
  selectedIndexes: number[] = []

  get smthIsSelected() { return this.selectedIndexes.length }
  get currentIcon() { return this.subitemsAreShown ? this.iconActive : this.iconInactive }

  toggleSubitems() {
    this.subitemsAreShown = !this.subitemsAreShown
  }
  onSubitemClick(index) {
    const indexInSelected = this.selectedIndexes.indexOf(index)

    if (indexInSelected < 0) {
      this.selectedIndexes.push(index)
      this.selectedIndexes.sort()
    } else {
      this.selectedIndexes.splice(indexInSelected, 1)
    }
  }
  resetFilter() {
    this.selectedIndexes = []
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

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
</style>