<template lang="pug">
  include ../../tools/bemto.pug

  +b.title-table
    +e.wrapper(@click="onTitleClick" :class="{ 'is-disabled': !isSortable }")
      +e.text(v-html="title")
      +e.sort(v-if="isSortable")
        +e.I.sort-icon.el-icon-caret-top(:class="{ 'is-active': isAscSorted }")
        +e.I.sort-icon.el-icon-caret-bottom(:class="{ 'is-active': isDescSorted }")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'

@Component({
})

export default class TitleTable extends Vue {
  @Prop() title: string
  @Prop() isSortable: boolean
  @Prop() isAscSorted: boolean
  @Prop() isDescSorted: boolean

  // SORT METHODS (TABLE HEAD)
  onTitleClick() {
    this.$emit('titleClicked')
  }
}
</script>

<style lang="stylus" scoped>
@import '../../styles/tools'

.title-table

  &__wrapper
    display flex
    align-items center
    padding 10px
    margin -10px
    transition(opacity)
    cursor pointer
    &:hover
      opacity .75
    &.is-disabled
      pointer-events none

  &__text
    margin-right 3px

  &__sort
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
</style>