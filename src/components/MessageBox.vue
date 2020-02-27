<template lang="pug">
  include ../tools/bemto.pug

  +b.msg-box
    +e.container(v-click-outside="onClickOutside")
      +e.header
        +e.title(v-if="content && content.title") {{ content.title }}
        +e.btn-close(@click="onCloseClick")
          +e.I.icon-close.el-icon-close.modal-icon-close
      +e.content(v-if="content && content.msg") {{ content.msg }}
      +e.btns
        ButtonApp(v-if="content && content.firstBtn" :btnType="firstBtn.type" :isPlain="firstBtn.isPlain" @clicked="onFirstBtnClick" :text="content.firstBtn" class="msg-box__btn")
        ButtonApp(v-if="content && content.secondBtn" :btnType="secondBtn.type" :isPlain="secondBtn.isPlain" @clicked="onSecondBtnClick" :text="content.secondBtn" class="msg-box__btn")
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { MsgBoxContent, Button } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'
import vCLickOutside from 'v-click-outside'

@Component({
  directives: {
    clickOutside: vCLickOutside.directive
  },
  components: {
    ButtonApp
  }
})

export default class MessageBox extends Vue{
  @Prop() content: MsgBoxContent
  @Prop( { default: function() { return { type: 'primary', isPlain: false }} }) firstBtn: Button
  @Prop( { default: function() { return { type: 'success', isPlain: true }} }) secondBtn: Button

  onCloseClick() {
    this.$emit('close')
  }
  onFirstBtnClick() {
    this.$emit('firstBtnClicked')
  }
  onSecondBtnClick() {
    this.$emit('secondBtnClicked')
  }
  onClickOutside(evt) {
    const targetIsModal = evt.srcElement.classList.contains('modal-msg')
    if (targetIsModal) this.onCloseClick()
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.msg-box

  &__container
    padding 15px
    background-color white
    border 1px solid $cLighterBorder
    border-radius 4px
    font-size 18px
    box-shadow 0 2px 12px 0 rgba(0,0,0,.1)
    overflow hidden
    transition(transform)
    +gt-sm()
      max-width 40vw
      min-width 420px
    +xs()
      width 100%
      height 100%
      display flex
      flex-direction column
      justify-content center
      align-items center
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
    +xs()
      position absolute
      top 10px
      right 10px

  &__title
    color $cPrimaryText
    line-height 1

  &__content
    margin-bottom 25px
    color $cRegularText
    font-size 14px
    line-height 1.25
    &:first-letter
      text-transform capitalize

  &__btns
    display flex
    justify-content flex-end

  &__btn
    &:not(:last-child)
      margin-right 10px
</style>