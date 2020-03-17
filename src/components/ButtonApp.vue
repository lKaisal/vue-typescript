<template lang="pug">
  include ../tools/bemto.pug

  +b.button-app
    +e.container(:style="setContainerStyle()" @click="onClick"
      :class="[btnType, { 'is-plain': isPlain, 'is-disabled': isDisabled, 'is-low': isLow, 'is-height-auto': isHeightAuto }]")
      +e.text(:style="setTextStyle()" v-html="text")
      +e.icon-wrapper(v-if="icon")
        +e.I.icon(:class="icon")
        //- IconSvg(:icon="icon" class="button-app__icon")
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref, Watch } from 'vue-property-decorator'
import IconSvg from '@/components/IconSvg.vue'

@Component({
  components: {
    IconSvg
  }
})

export default class ButtonApp extends Vue {
  @Prop({default: 'primary'}) btnType: string
  @Prop() isPlain: boolean
  @Prop() text: string
  @Prop() isDisabled: boolean
  @Prop() icon: string
  @Prop() width: number
  @Prop() isLow: boolean
  @Prop() isHeightAuto: boolean
  @Prop() fontSize: number

  setContainerStyle() {
    return `width: ${this.width || 'auto'}px;`
  }
  setTextStyle() {
    return `font-size: ${this.fontSize || 'inherit'}px;`
  }
  onClick() {
    if (this.isDisabled) return

    this.$emit('clicked')
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.button-app

  &__container
    display inline-flex
    justify-content center
    align-items center
    padding 14px 20px
    max-height 100%
    text-align center
    color white
    border-radius 4px
    cursor pointer
    &.is-disabled
      opacity .75
      cursor url('/static/images/block.png'), not-allowed
    &.is-low
      padding 10px 20px
      +lt-lg()
        padding 10px
    &.is-height-auto
      padding 0 20px
      height 100%
    &.primary
      background-color $cBrand
      border 1px solid $cBrand
      transition(background-color\, color)
      &:not(.is-disabled)
        &:hover
          background-color white
          color $cBrand
      &.is-plain
        background-color white
        color $cBrand
        &:not(.is-disabled)
          &:hover
            background-color $cBrand
            color white
    &.danger
      background-color $cDanger
      border 1px solid $cDanger
      transition(background-color\, color)
      &:not(.is-disabled)
        &:hover
          background-color white
          color $cDanger
      &.is-plain
        background-color white
        color $cDanger
        &:not(.is-disabled)
          &:hover
            background-color $cDanger
            color white
    &.warning
      background-color $cWarning
      border 1px solid $cWarning
      transition(background-color\, color)
      &:not(.is-disabled)
        &:hover
          background-color white
          color $cWarning
      &.is-plain
        background-color white
        color $cWarning
        &:not(.is-disabled)
          &:hover
            background-color $cWarning
            color white
    &.success
      background-color $cSuccess
      border 1px solid $cSuccess
      transition(background-color\, color)
      &:not(.is-disabled)
        &:hover
          background-color white
          color $cSuccess
      &.is-plain
        background-color white
        color $cSuccess
        &:not(.is-disabled)
          &:hover
            background-color $cSuccess
            color white
    &.primaryText
      background-color $cGreen
      border 1px solid $cGreen
      transition(background-color\, color)
      &:not(.is-disabled)
        &:hover
          background-color white
          color $cGreen
      &.is-plain
        background-color white
        color $cGreen
        &:not(.is-disabled)
          &:hover
            background-color $cGreen
            color white

  &__text
    // display inline-block
    white-space nowrap
    font-size 14px
    fontMedium()
    user-select none

  &__icon-wrapper
    position relative
    display flex
    justify-content center
    align-items center
    margin-left 15px
    fill white
    width 15px
    height 15px

  &__icon
    position absolute
    width 100%
    height 100%
    text-align center
    fill white
    transition(fill)
    .is-plain.primary &
      fill $cBrand
    .is-plain.warning &
      fill $cWarning
    .is-plain.danger &
      fill $cDanger
    .is-plain.success &
      fill $cSuccess
    .button-app__container.is-plain:not(.is-disabled):hover &
      fill white
    .button-app__container:not(.is-plain).primary:hover &
      fill $cBrand
    .button-app__container:not(.is-plain).warning:hover &
      fill $cWarning
    .button-app__container:not(.is-plain).danger:hover &
      fill $cDanger
    .button-app__container:not(.is-plain).success:hover &
      fill $cSuccess
</style>