<template lang="pug">
  include ../../../tools/bemto.pug

  +b.phone-manage
    +e.row
      +e.EL-SELECT.select(v-model="activeIndex" @change="onSelectChange")
        +e.EL-OPTION(v-for="(country, index) in countries" :key="country.code" :label="('+' + country.phoneCode + ' ' + country.code).toString()" :value="index")
      +e.EL-INPUT.input(v-model="number" ref="numberRef")
      ButtonApp(:isHeightAuto="true" text="Сменить номер")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Ref } from 'vue-property-decorator'
import { phonesMapper } from '../module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import { Supplier, Country } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'
import vClickOutside from 'v-click-outside'
import Inputmask from 'inputmask'
import { ElSelect } from 'element-ui/types/select'

const Mappers = Vue.extend({
  computed: {
    ...phonesMapper.mapState(['countries'])
  }
})

@Component({
  components: {
    ButtonApp
  }
})

export default class PhoneManage extends Mixins(Mappers, MsgBoxToolsApp, MsgBoxTools) {
  @Prop() id: Supplier['id']
  @Ref() numberRef!: ElSelect
  im = null
  activeIndex: number = 0
  number: string = null
  get activeCountry() { return this.countries[this.activeIndex] }
  get countryCode() { return this.activeCountry.phoneCode }
  get activeMask() { return this.activeCountry.mask }

  async mounted() {
    this.initInputmask()
  }

  initInputmask() {
    const container = this.numberRef && this.numberRef.$el.firstElementChild

    if (!container) return

    this.im = new Inputmask({mask: this.activeMask})
    this.im.mask(container)
  }
  destroyInputmask() {
    const container = this.numberRef && this.numberRef.$el.firstElementChild
    if (!container) return
    this.im.remove()
    this.im = undefined
  }
  async onSelectChange() {
    this.destroyInputmask()
    await this.$nextTick()
    this.initInputmask()
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.phone-manage

  &__row
    display flex
    justify-content center

  &__select
    max-width 110px
    margin-right 10px

  &__input
    width 130px
    margin-right 10px
</style>
