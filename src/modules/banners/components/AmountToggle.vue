<template lang="pug">
  include ../../../tools/bemto.pug

  +b.amount-toggle
    +e.row
      +e.LABEL.label(for="amount") Количество активных баннеров:
      +e.input-toggle
        +e.EL-INPUT.input(v-model="amount" min="1" max="10")
        +e.toggle
          +e.I.icon._up.el-icon-arrow-up
          +e.line
          +e.I.icon._down.el-icon-arrow-down
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { MsgBoxContent, Button } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'

@Component({
  components: {
    ButtonApp
  }
})

export default class AmountToggle extends Vue{
  amount: number = 1

  handleChange(evt) {
    console.log(evt)
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.amount-toggle

  &__row
  &__input-toggle
    display flex
    align-items center

  &__label
    margin-right 10px
    fontMedium()

  &__input-toggle
    margin-right 20px

  &__input
    width 45px
    height 45px
    >>> input
      width 100%
      height 100%

  &__icon
    width 20px
    height 20px
    background-color $cBrand
    color white
    display flex
    justify-content center
    align-items center
    // &_up
    //   border-radius 4px 4px 0 0
    // &_down
    //   border-radius 0 0 4px 4px

  &__line
    width 100%
    height 1px
    background-color white
</style>