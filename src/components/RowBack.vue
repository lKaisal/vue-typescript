<template lang="pug">
  include ../tools/bemto.pug

  +b.row-back
    +e.container(@click="onClick")
      +e.I.icon.el-icon-back
      +e.text(v-html="text")

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
})

export default class RowBack extends Vue {
  @Prop() text: string

  onClick() {
    this.$emit('clicked')
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.row-back
  &__container
    display flex
    flex-wrap nowrap
    padding 10px
    margin -10px
    cursor pointer
    fontMedium()
    &:hover
      opacity .75
    &.v-enter
      jsVoaStart()

  &__icon
    transition(transform)
    .row-back__container:hover &
      transform translateX(-5px)

  &__text
    margin-left 10px
    white-space nowrap
</style>