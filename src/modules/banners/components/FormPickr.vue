<template lang="pug">
  include ../../../tools/bemto.pug

  +b.form-pickr
    +e.row.form-row
      +e.field._active-from.form-field(:class="{ 'is-invalid': isInvalid(activeFromField), 'is-filled': !!activeFrom, 'is-disabled': isDisabled }")
        +e.label.form-label
          +e.LABEL.label(for="activeFrom") Дата начала
        +e.input-wrapper.form-input-wrapper
          +e.INPUT.pickr.el-input__inner.form-pickr(ref="fromRef" v-model="activeFrom" placeholder="31-12-2020")
          +e.I.icon-clear.el-icon-close.form-icon-clear(@click="clearPicker(pickrFrom)")
        +e.error.form-error(v-html="activeFromField.errorMsg")
      +e.field._active-to.form-field(:class="{ 'is-invalid': isInvalid(activeToField), 'is-filled': !!activeTo, 'is-disabled': isDisabled }")
        +e.label.form-label
          +e.LABEL.label(for="activeTo") Дата окончания
        +e.input-wrapper.form-input-wrapper
          +e.INPUT.pickr.el-input__inner.form-pickr(ref="toRef" v-model="activeTo" placeholder="31-12-2020")
          +e.I.icon-clear.el-icon-close.form-icon-clear(@click="clearPicker(pickrTo)")
        +e.error.form-error(v-html="activeToField.errorMsg")
    +e.comment.form-comment(:class="{ 'is-transparent': isInvalid(activeFromField) || isInvalid(activeToField) }") Заполнить для баннеров с отложенным стартом
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop } from 'vue-property-decorator'
import trim from 'validator/lib/trim'
import { ElInput } from 'element-ui/types/input'
import { Banner, BannerForm, FormField } from '../models'
import { bannersMapper } from '../module/store'
import { ElSelect } from 'element-ui/types/select'
import flatpickr from 'flatpickr'
import { Russian } from 'flatpickr/dist/l10n/ru.js'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['form']),
    ...bannersMapper.mapGetters(['formActiveFrom', 'formActiveTo'])
  },
  methods: {
    ...bannersMapper.mapActions(['updateField'])
  }
})

@Component({
})

export default class FormPickr extends Mappers {
  @Prop() isDisabled: boolean
  @Ref() fromRef: HTMLElement
  @Ref() toRef: HTMLElement
  dateFormat: string = 'd-m-Y'
  pickrFrom = null
  pickrTo = null

  // FORM FIELD
  get activeFromField() { return this.formActiveFrom }
  get activeToField() { return this.formActiveTo }

  // FORM SET/GET FIELDS VALUES
  get activeFrom() { return this.activeFromField.value }
  set activeFrom(value) { this.updateField({name: 'activeFrom', value}) }
  get activeTo() { return this.activeToField.value }
  set activeTo(value) { this.updateField({name: 'activeTo', value}) }

  async mounted() {
    await this.$nextTick()
    this.initPickers()
  }
  beforeDestroy() {
    if (this.pickrFrom) this.pickrFrom.destroy()
    if (this.pickrTo) this.pickrTo.destroy()
  }

  // METHODS
  isInvalid(field: FormField) {
    return this.form.validationIsShown && !this.isDisabled && field.validationRequired && !field.isValid
  }
  /** Date-pickers for activeFrom/activeTo */
  initPickers() {
    const configOpts = { 'locale': Russian, dateFormat: this.dateFormat, minDate: new Date(), disableMobile: true }

    // activeFrom
    const configFrom = Object.assign(configOpts, { onChange: async (dateStr) => {
      if (!dateStr || !dateStr[0]) return

      const dateStrFormatted = this.pickrFrom.formatDate(dateStr[0], this.dateFormat)

      await this.$nextTick()
      // check activeTo: if it is smaller -> set it to activeFrom date
      const pickrToTime = this.pickrTo.selectedDates[0] && this.pickrTo.selectedDates[0].getTime()
      const dateStrTime = new Date(dateStr).getTime()
      if (this.pickrTo && ((pickrToTime && pickrToTime < dateStrTime) || !pickrToTime)) this.activeTo = dateStrFormatted

      // upd activeTo minDate (equal to activeFrom date)
      if (this.pickrTo) this.pickrTo.set('minDate', dateStrFormatted)
    } })
    this.pickrFrom = flatpickr(this.fromRef, configFrom)

    // activeTo
    const configTo = Object.assign(configOpts, { onChange: async (dateStr) => {
      if (!dateStr || !dateStr[0]) return

      await this.$nextTick()
      // check activeFrom: if it exists -> set it to min activeTo date
      const pickrFromDate = this.pickrFrom.selectedDates[0]
      if (this.pickrFrom && pickrFromDate) this.pickrTo.set('minDate', pickrFromDate)
      else this.pickrTo.set('minDate', new Date())
    } })
    this.pickrTo = flatpickr(this.toRef, configTo)
  }
  clearPicker(picker) {
    picker.clear()
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../../../../node_modules/flatpickr/dist/flatpickr.min.css'

.form-pickr

  &__row
    max-width 450px
    +gt-sm()
      display flex
      justify-content space-between
      flex-wrap nowrap
      .form-pickr__field
        &:not(:last-child)
          margin-right 10px

  &__field
    margin-bottom 7px
</style>