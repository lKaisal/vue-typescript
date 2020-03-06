<template lang="pug">
  include ../../../tools/bemto.pug

  +b.phone-manage
    +e.row
      +e.EL-SELECT.select.is-filled(v-model="activeIndex" @change="onSelectChange" ref="selectRef")
        +e.EL-OPTION(v-for="(country, index) in countries" :key="country.code" :label="('+' + country.phoneCode).toString()" :value="index")
          IMG(:src="`/static/images/${country.name.toLowerCase()}.svg`" class="phone-manage__img")
          +e.SPAN(v-html="`+${country.phoneCode}`")
      +e.EL-INPUT.input(v-model="number" ref="numberRef" :class="{ 'is-filled': number, 'is-invalid': numberIsInvalid && !inputFocused }" @focus="inputFocused=true" @blur="inputFocused=false")
      +e.btn._confirm(:class="{ 'is-disabled': !number || numberIsInvalid }")
        +e.I.btn-icon._confirm.el-icon-check
      +e.btn._discard(@click="discard")
        +e.I.btn-icon._discard.el-icon-close
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Ref } from 'vue-property-decorator'
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
  @Prop() userId: Supplier['userId']
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
  removeSelectIcon() {

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
    align-items center
    // justify-content center

  &__select
    max-width 110px
    margin-right 10px

  &__input
    width 130px
    margin-right 10px

  &__select
  &__input
    >>> input
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
      // background url('/static/images/russia.svg') no-repeat
      background-repeat no-repeat
      background-position 15px center
      background-size 20%
      padding-left 45px

  &__img
    width 20px
    margin-right 15px
    transform translateY(4px)

  &__btn
    width 40px
    height 40px
    display flex
    justify-content center
    align-items center
    border-radius 5px
    cursor pointer
    transition(background-color\, opacity)
    &:not(:last-child)
      margin-right 10px
    &.is-disabled
      opacity .75
      cursor not-allowed
    >>> i
      font-size 20px
      transition(color)
    &_confirm
      border 1px solid $cBrand
      background-color $cBrand
      >>> i
        color white
      &:not(.is-disabled)
        &:hover
          background-color white
          >>> i
            color $cBrand
    &_discard
      border 1px solid $cDanger
      background-color white
      >>> i
        color $cDanger
      &:hover
        background-color $cDanger
        >>> i
          color white
</style>
