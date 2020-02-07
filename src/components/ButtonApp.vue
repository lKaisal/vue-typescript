<template lang="pug">
  include ../tools/bemto.pug

  +b.button-app
    +e.container(:class="colorClass" @click="onClick")
      +e.text(v-html="text")
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref, Watch } from 'vue-property-decorator'

@Component({
})

export default class ButtonApp extends Vue {
  @Prop({default: 'is-primary'}) colorClass: String
  @Prop() text: String

  onClick() {
    this.$emit('clicked')
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.button-app

  &__container
    display inline-block
    // justify-content center
    // align-items center
    padding 14px 20px
    color white
    border-radius 4px
    cursor pointer
    &.is-primary
      background-color $cBrand
      border 1px solid $cBrand
      transition(background-color\, color)
      &:hover
        background-color white
        color $cBrand

  &__text
    white-space nowrap
    font-size 14px
    fontMedium()
</style>