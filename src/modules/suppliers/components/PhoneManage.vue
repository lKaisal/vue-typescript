<template lang="pug">
  include ../../../tools/bemto.pug

  +b.phone-manage
    +e.row
      +e.H5.title(@click="showInput" :class="{ 'is-disabled': inputIsShown }") Сменить номер телефона
    transition(mode="out-in")
      +e.row(v-show="inputIsShown")
        +e.form
          +e.EL-SELECT.select.is-filled(v-model="activeIndex" size="mini" @change="onSelectChange" ref="selectRef")
            +e.EL-OPTION(v-for="(country, index) in countries" :key="country.code" :label="('+' + country.phoneCode).toString()" :value="index")
              IMG(:src="`/static/images/${country.name.toLowerCase()}.svg`" class="phone-manage__img")
              +e.SPAN(v-html="`+${country.phoneCode}`")
          +e.EL-INPUT.input(v-model="number" ref="numberRef" size="mini" :class="{ 'is-filled': number, 'is-invalid': numberIsInvalid && !inputFocused }"
            @focus="inputFocused=true" @blur="inputFocused=false")
        +e.btns
          +e.btn._confirm(:class="{ 'is-disabled': !number || numberIsInvalid }" @click="confirm")
            +e.I.btn-icon._confirm.el-icon-check
          +e.btn._discard(@click="discard")
            +e.I.btn-icon._discard.el-icon-close
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Ref, Watch } from 'vue-property-decorator'
import { suppliersMapper } from '../module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import { Supplier, Country } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'
import vClickOutside from 'v-click-outside'
import Inputmask from 'inputmask'
import { ElSelect } from 'element-ui/types/select'
import IconSvg from '@/components/IconSvg.vue'
import { ElInput } from 'element-ui/types/input'

const Mappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapState(['countries'])
  }
})

@Component({
  components: {
    ButtonApp,
    IconSvg
  }
})

export default class PhoneManage extends Mixins(Mappers, MsgBoxToolsApp, MsgBoxTools) {
  @Prop() inputIsShown: boolean
  @Ref() selectRef!: ElSelect
  @Ref() numberRef!: ElInput
  im = null
  activeIndex: number = 0
  number: string = null
  numberIsComplete: boolean = false
  inputFocused: boolean = false
  get activeCountry() { return this.countries[this.activeIndex] }
  get countryCode() { return this.activeCountry.phoneCode }
  get activeFlag() { return `/static/images/${this.activeCountry.name.toLowerCase()}.svg` }
  get activeMask() { return this.activeCountry.mask }
  get numberIsInvalid() { return this.number && !this.numberIsComplete }
  get fullNumber() { return this.countryCode.toString() + this.number.toString() }

  @Watch('inputIsShown')
  async onInputIsShownChange(val) {
    if (val) {
      this.activeIndex = 0
      this.number = null
      await this.$nextTick()
      this.initInputmask()
      this.setSelectFlag()
    }
  }
  async mounted() {
    await this.$nextTick()
    this.initInputmask()
    this.setSelectFlag()
  }

  initInputmask() {
    const container = this.numberRef && this.numberRef.$el.firstElementChild

    if (!container) return

    this.im = new Inputmask({mask: this.activeMask, 'oncomplete': () => this.numberIsComplete = true, 'onincomplete': () => this.numberIsComplete = false})
    this.im.mask(container)
  }
  destroyInputmask() {
    const container = this.numberRef && this.numberRef.$el.firstElementChild
    if (!container) return
    this.im.remove()
    this.im = undefined
  }
  async onSelectChange() {
    this.number = null
    this.numberIsComplete = false
    this.destroyInputmask()
    this.setSelectFlag()
    await this.$nextTick()
    this.initInputmask()
  }
  setSelectFlag() {
    const container = this.selectRef && this.selectRef.$el.firstElementChild.firstElementChild
    if (!container) return
    container.setAttribute('style', `background-image: url(${this.activeFlag})`)
  }
  showInput() {
    this.$emit('showInput')
  }
  confirm() {
    if (!this.number || this.numberIsInvalid) return

    this.$emit('confirm', this.fullNumber)
  }
  discard() {
    this.$emit('discard')
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.phone-manage

  &__row
    display flex
    // align-items center
    // justify-content center
    transition(opacity)
    &.v-enter
    &.v-elave-to
      opacity 0
    +xs()
      flex-wrap wrap

  &__title
    display inline
    padding 5px
    margin -5px
    margin-bottom 0px
    color $cBrand
    border-bottom 1px dashed $cBrand
    border-color $cBrand
    fontReg()
    cursor pointer
    transition(opacity\, border-color)
    transition-delay $tFast
    &:hover
      opacity .75
    &.is-disabled
      border-color transparent
      transition-delay 0s
      pointer-events none

  &__select
    max-width 110px
    margin-right 10px

  &__input
    width 130px
    margin-right 10px

  &__select
  &__input
    >>> input
      width-between-property 'font-size' 601 12 1000 14 true true
      transition(border-color)
    &.is-filled
      >>> input
        border-color $cBrand
    &.is-invalid
      >>> input
        border-color $cDanger

  &__select
    >>> input
      position relative
      background-repeat no-repeat
      background-position 15px center
      background-size 20%
      padding-left 45px

  &__img
    width 20px
    margin-right 5px
    transform translateY(4px)

  &__form
  &__btns
    display flex
    +xs()
      margin-bottom 15px
      flex-grow 1
      justify-content center

  &__form
    +gt-sm()
      margin-right 10px

  &__btn
    // width-between-property 'width' 320 30 600 30 true true
    width 27px
    // width-between-property 'height' 320 30 600 30 true true
    height 27px
    display flex
    justify-content center
    align-items center
    // border-radius 5px
    cursor pointer
    transition(background-color\, opacity)
    &:not(:last-child)
      // margin-right 10px
    &.is-disabled
      opacity .75
      cursor not-allowed
    >>> i
      font-size 20px
      transition(color)
    &_confirm
      border 1px solid $cBrand
      border-radius 5px 0 0 5px
      background-color white
      >>> i
        color $cBrand
      &:not(.is-disabled)
        &:hover
          background-color $cBrand
          >>> i
            color white
    &_discard
      border 1px solid $cDanger
      border-radius 0 5px 5px 0
      background-color white
      >>> i
        color $cDanger
      &:hover
        background-color $cDanger
        >>> i
          color white
</style>
