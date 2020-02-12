<template lang="pug">
  include ../tools/bemto.pug

  +b.button-app
    +e.container(:class="[btnType, { 'is-plain': isPlain, 'is-disabled': disabled }]" @click="onClick")
      +e.text(v-html="text")
      +e.icon-wrapper(v-if="icon")
        +e.I.icon(:class="icon")
      //- IconSvg(icon="clean" class="button-app__icon")
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
  @Prop() disabled: boolean
  @Prop() icon: string

  onClick() {
    if (this.disabled) return

    this.$emit('clicked')
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.button-app

  &__container
    display inline-flex
    // justify-content center
    align-items center
    padding 14px 20px
    max-height 100%
    color white
    border-radius 4px
    cursor pointer
    &.is-disabled
      opacity .75
      cursor url("/static/images/block.png"), not-allowed
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

  &__text
    // display inline-block
    white-space nowrap
    font-size 14px
    fontMedium()
    user-select none

  &__icon-wrapper
    position relative
    // display inline-block
    margin-left 10px
    fill white
    width 20px
    height 20px

  &__icon
    position absolute
    width 100%
    height 100%
</style>