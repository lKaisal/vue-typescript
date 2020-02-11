<template lang="pug">
  include ../../../tools/bemto.pug

  +b.toggle-amount
    +e.row
      +e.label Количество активных баннеров:
      +e.data
        +e.amount(v-html="activeAmount")
        +e.icon-wrapper._edit(@click="clicked")
          +e.I.icon._edit.el-icon-edit
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Ref } from 'vue-property-decorator'
import { MsgBoxContent, Button } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'
import { bannersMapper, banners } from '../module/store'
import Inputmask from 'inputmask'
import { ElInput } from 'element-ui/types/input'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['activeAmount'])
  },
})

@Component({
  components: {
    ButtonApp
  }
})

export default class ToggleAmount extends Mixins(Mappers) {
  clicked() {
    this.$emit('editClicked')
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.toggle-amount

  &__row
    display flex
    align-items center

  &__label
    margin-right 10px
    fontMedium()

  &__data
    // padding 10px
    // width 60px
    display flex
    border 1px solid $cBrand
    border-radius 4px
    overflow hidden

  &__amount
    position relative
    width 45px
    padding 8px
    text-align center
    fontMedium()
    color $cBrand
    &:after
      content ''
      position absolute
      top -12px
      right 0
      bottom -10px
      width 1px
      border-right 1px solid $cBrand

  &__icon-wrapper
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
    background-color $cBrand
    color white
    cursor pointer
    transition(color\, background-color )
    &:hover
      color $cBrand
      background-color white
    &_edit
      position relative
      width 30px
      height auto
      display flex
      justify-content center
      align-items center
</style>