<template lang="pug">
  include ../../../tools/bemto.pug

  +b.msg-box
    +e.container
      +e.header
        +e.title(v-if="content && content.title") {{ content.title }}
        +e.btn-close(@click="onCloseClick")
          i.el-icon-close.msg-box__icon-close
      +e.content(v-if="content && content.msg") {{ content.msg }}
      +e.btns
        ButtonApp(v-if="content && content.firstBtn" colorClass="firstBtn.type" :plain="firstBtn.isPlain" @clicked="onFirstBtnClick" text="content.firstBtn")
        ButtonApp(v-if="content && content.secondBtn" colorClass="secondBtn.type" :plain="secondBtn.isPlain" @clicked="onSecondBtnClick" text="content.secondBtn")
        //- +e.EL-BUTTON(v-if="content && content.firstBtn" :type="firstBtn.type" :plain="firstBtn.isPlain" @click="onFirstBtnClick") {{ content.firstBtn }}
        //- +e.EL-BUTTON(v-if="content && content.secondBtn" :type="secondBtn.type" :plain="secondBtn.isPlain" @click="onSecondBtnClick") {{ content.secondBtn }}
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { MsgBoxContent, Button } from '../models'
import msgBoxTools from '../mixins/msgBoxTools'
import ButtonApp from '@/components/ButtonApp.vue'

@Component({
  components: {
    ButtonApp
  }
})

export default class MessageBox extends Vue{
  @Prop() content: MsgBoxContent
  @Prop( { default: function() { return { type: 'is-primary', isPlain: false }} }) firstBtn: Button
  @Prop( { default: function() { return { type: 'is-success', isPlain: true }} }) secondBtn: Button

  onCloseClick() {
    this.$emit('close')
  }
  onFirstBtnClick() {
    this.$emit('firstBtnClicked')
  }
  onSecondBtnClick() {
    this.$emit('secondBtnClicked')
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.msg-box

  &__container
    min-width 420px
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