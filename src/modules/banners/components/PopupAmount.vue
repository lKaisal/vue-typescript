<template lang="pug">
  include ../../../tools/bemto.pug

  +b.popup-amount
    +e.container.modal-popup-container(v-click-outside="onClickOutside")
      +e.btn-close(@click="cancelClicked")
        +e.I.icon-close.el-icon-close.modal-icon-close
      +e.row._label
        +e.LABEL.label(for="amount") Изменить количество активных баннеров
      +e.row._toggle
        +e.icon-wrapper._minus(@click="amount--" :class="{ 'is-disabled': amount === 1 }")
          +e.I.icon._minus.el-icon-minus
        +e.EL-INPUT.input(v-model="amount" @input="onInputUpdate" :placeholder="activeAmount.value")
        +e.icon-wrapper._plus(@click="amount++" :class="{ 'is-disabled': amount === 9 }")
          +e.I.icon._plus.el-icon-plus
      +e.btns
        ButtonApp(:isDisabled="!amount" text="Подтвердить" @clicked="confirmClicked" class="popup-amount__btn")
        ButtonApp(btnType="danger" text="Отмена" @clicked="cancelClicked" class="popup-amount__btn")
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Mixins, Ref } from 'vue-property-decorator'
import { MsgBoxContent, Button } from '@/models'
import ButtonApp from '@/components/ButtonApp.vue'
import { bannersMapper, banners } from '../module/store'
import { ElInput } from 'element-ui/types/input'
import vClickOutside from 'v-click-outside'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['activeAmount'])
  },
})

@Component({
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    ButtonApp
  }
})

export default class PopupAmount extends Mixins(Mappers) {
  amount: number = null

  get activeAmountValue() { return this.activeAmount.value }

  @Watch('activeAmountValue')
  onActiveAmountValueChange(val) {
    this.amount = val
  }

  // HOOKS
  created() {
    document.addEventListener('keydown', this.keyDownHandler)
  }
  async mounted() {
    this.amount = this.activeAmount.value
  }
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyDownHandler)
    this.amount = this.activeAmount.value
  }

  // METHODS
  keyDownHandler(evt: KeyboardEvent) {
    if (evt.key === 'Escape') this.cancelClicked()
  }
  confirmClicked() { this.$emit('confirm', this.amount) }
  cancelClicked() { this.$emit('cancel') }
  onClickOutside(evt) {
    const targetIsModal = evt.srcElement.classList.contains('page-main__popup-amount')
    if (targetIsModal) this.cancelClicked()
  }
  onInputUpdate(val) {
    if (!Number(val)) this.amount = null
    else if (val.length > 1) this.amount = val.slice(0, 1)
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.popup-amount

  &__container
    position relative
    padding 50px

  &__btn-close
    position absolute
    top 10px
    right 10px
    cursor pointer
    transition()
    &:hover
      opacity .75

  &__row
    display flex
    &_label
      margin-bottom 25px
    &_toggle
      margin-bottom 25px
      justify-content center

  &__icon-wrapper
    width 40px
    height 40px
    display flex
    justify-content center
    align-items center
    background-color $cExLightBorder
    color $cRegularText
    border 1px solid $cBaseBorder
    cursor pointer
    transition(color\, background-color\, border-colo, opacity)
    &:hover
      color $cBrand
      background-color $cBrandLight
    &:active
      color $cBrand
      background-color white
      border-color $cBrandMedium
    &_minus
      border-radius 4px 0 0 4px
      border-color $cBaseBorder transparent $cBaseBorder $cBaseBorder
    &_plus
      border-radius 0 4px 4px 0
      border-color $cBaseBorder $cBaseBorder $cBaseBorder transparent
    &.is-disabled
      opacity .5
      pointer-events none

  &__input
    width 60px
    height 40px
    border-radius 0
    font-size 16px
    >>> input
      width 100%
      height 100%
      border-radius 0
      text-align center

  &__btns
    display flex
    justify-content center

  &__btn
    &:not(:last-child)
      margin-right 10px
</style>