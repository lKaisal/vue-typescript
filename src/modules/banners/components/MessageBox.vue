<template lang="pug">
  include ../../../tools/bemto.pug

  +b.msg-box
    +e.container(:key="loading")
      +e.header
        +e.title {{ content.title }}
        +e.btn-close(@click="onCloseClick")
          i.el-icon-close.msg-box__icon-close
      +e.content {{ content.msg }}
      +e.btns
        +e.EL-BUTTON(type="primary" @click="onResetClick" :loading="loading") {{ content.loadBtn }}
        //- +e.EL-BUTTON(type="primary" plain @click="onCloseClick") Закрыть
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { MsgBoxContent } from '../models'

@Component({
})

export default class MessageBox extends Vue {
  @Prop() content: MsgBoxContent
  @Prop() loading: boolean

  onCloseClick() {
    this.$emit('close')
  }
  onResetClick() {
    this.$emit('reset')
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.msg-box

  &__container
    width 420px
    padding 15px
    background-color white
    border 1px solid $cLighterBorder
    border-radius 4px
    font-size 18px
    box-shadow 0 2px 12px 0 rgba(0,0,0,.1)
    overflow hidden
    transition(transform)
    .v-enter &
    .v-leave-to &
      transform translateY(-30px)

  &__header
    margin-bottom 10px
    display flex
    justify-content space-between
    align-items center

  &__btn-close
    cursor pointer

  &__icon-close
    color $cSecondaryText
    font-size 16px

  &__title
    color $cPrimaryText
    line-height 1

  &__content
    margin-bottom 25px
    color $cRegularText
    font-size 14px

  &__btns
    display flex
    justify-content flex-end
</style>