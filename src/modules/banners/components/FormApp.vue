<template lang="pug">
  include ../../../tools/bemto.pug

  +b.form-app
    +e.field._img(:class="{ 'is-invalid': isInvalid(fileField) }")
      DragDrop(class="form-app__drag-drop")
      +e.error(v-html="fileField.errorMsg")
    +e.field._news-id(:class="{ 'is-invalid': isInvalid(newsIdField), 'is-filled': newsId }")
      +e.label
        +e.LABEL(for="newsId") Id новости
      +e.EL-INPUT.input(placeholder="000" v-model="newsId")
      +e.error(v-html="newsIdField.errorMsg")
    +e.field._page-type(:class="{ 'is-invalid': isInvalid(pageTypeField), 'is-filled': !!pageType }")
      +e.label
        +e.LABEL(for="pageType") Тип страницы
      +e.EL-INPUT.input(placeholder="type" v-model="pageType")
      +e.error(v-html="pageTypeField.errorMsg")
    +e.row
      +e.field._active-from(:class="{ 'is-filled': !!activeFrom }")
        +e.label
          +e.LABEL.label(for="activeFrom") Дата начала
        +e.INPUT.pickr.el-input__inner(ref="fromRef" placeholder="DD-MM-YYYY HH:MM" v-model="activeFrom")
        +e.error(v-html="activeFromField.errorMsg")
      +e.field._active-to(:class="{ 'is-filled': !!activeTo }")
        +e.label
          +e.LABEL.label(for="activeTo") Дата окончания
        +e.INPUT.pickr.el-input__inner(ref="toRef" placeholder="DD-MM-YYYY HH:MM" v-model="activeTo")
        +e.error(v-html="activeToField.errorMsg")
    +e.field._is-active(:class="{ 'is-invalid': isInvalid(isActiveField) }")
      +e.LABEL.label(for="isActive") Показывать в приложении
      +e.EL-CHECKBOX.checkbox(v-model="isActive")
      +e.error(v-html="isActiveField.errorMsg")
    +e.field._sort(:class="{ 'is-invalid': isInvalid(sortField), 'is-filled': sortBy }")
      +e.LABEL.label(for="sortBy") Положение баннера
      +e.EL-SELECT.select(ref="select" v-model="sortBy" :placeholder="(maxSortBy + 1).toString()")
        +e.EL-OPTION(v-for="n in maxSortBy + 1" :key="n" :label="n" :value="n")
      +e.error(v-html="sortField.errorMsg")
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'
import trim from 'validator/lib/trim'
import { Banner, BannerForm, MsgBoxContent } from '../models'
import DragDrop from './DragDrop.vue'
import flatpickr from 'flatpickr'
import { Russian } from 'flatpickr/dist/l10n/ru.js'
import { bannersMapper } from '../module/store'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['form']),
    ...bannersMapper.mapGetters(['listSorted', 'formSort', 'bannerById', 'formActiveFrom', 'formActiveTo', 'formIsActive', 'formFile', 'formNewsId', 'formPageType'])
  },
  methods: {
    ...bannersMapper.mapMutations(['setFormType', 'setValidationIsShown']),
    ...bannersMapper.mapActions(['getList', 'deleteBanner'])
  }
})

@Component({
  components: {
    DragDrop,
  }
})

export default class FormApp extends Mappers {
  pickrFrom = null
  pickrTo = null
  dateFormat: string = 'd-m-Y H:i'
  @Ref() fromRef: HTMLElement
  @Ref() toRef: HTMLElement

  get list() { return this.listSorted }
  get maxSortBy() { return this.list && this.list.length }

  // FORM FIELDS
  get activeFromField() { return this.formActiveFrom }
  get activeToField() { return this.formActiveTo }
  get isActiveField() { return this.formIsActive }
  get fileField() { return this.formFile }
  get newsIdField() { return this.formNewsId }
  get pageTypeField() { return this.formPageType }
  get sortField() { return this.formSort }

  // FORM SET/GET FIELDS VALUES
  get activeFrom() { return this.pickrFrom && this.pickrFrom.selectedDates.length && this.pickrFrom.formatDate(this.pickrFrom.selectedDates[0], this.dateFormat) }
  set activeFrom(value) { this.updateField({name: 'activeFrom', value}) }
  get activeTo() { return this.pickrTo && this.pickrTo.selectedDates.length && this.pickrTo.formatDate(this.pickrTo.selectedDates[0], this.dateFormat) }
  set activeTo(value) { this.updateField({name: 'activeTo', value}) }
  get isActive() { return this.isActiveField.value }
  set isActive(value) { this.updateField({name: 'isActive', value}) }
  get newsId() { return this.newsIdField.value }
  set newsId(value) { this.updateField({name: 'newsId', value: trim(value)}) }
  get pageType() { return this.pageTypeField.value }
  set pageType(value) { this.updateField({name: 'pageType', value: trim(value)}) }
  get sortBy() { return this.sortField.value }
  set sortBy(value) { this.updateField({name: 'sort', value}) }

  mounted() {
    this.initPickers()
  }

  beforeDestroy() {
    this.setValidationIsShown(false)
  }

  initPickers() {
    // activeFrom
    const configFrom = { 'locale': Russian, dateFormat: this.dateFormat, minDate: new Date(), enableTime: true, onChange: (dateStr) => {
      const dateStrFormatted = this.pickrFrom.formatDate(dateStr[0], this.dateFormat)
      if (this.pickrTo.selectedDates[0] && this.pickrTo.selectedDates[0].getTime() < new Date(dateStr).getTime()) this.pickrTo.setDate(dateStrFormatted)
      this.pickrTo.set('minDate', dateStrFormatted)
    } }
    this.pickrFrom = flatpickr(this.fromRef, configFrom)
    if (this.activeFromField.value) this.pickrFrom.setDate(this.activeFromField.value)

    // activeTo
    const configTo = { 'locale': Russian, dateFormat: this.dateFormat, minDate: new Date(), enableTime: true }
    this.pickrTo = flatpickr(this.toRef, configTo)
    if (this.activeToField.value) this.pickrTo.setDate(this.activeToField.value)
  }
  // FORM METHODS
  isInvalid(field) { return this.form.validationIsShown && field.validationRequired && !field.isValid }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../../../../node_modules/flatpickr/dist/flatpickr.min.css'

.form-app

  &__row
    display flex
    justify-content space-between
    flex-wrap wrap
    .form-app__field
      &:not(:last-child)
        margin-right 10px

  &__pickr
    z-index 5
    width 100%
    font-size 18px
    fontReg()
    color $cInfo
    .is-filled &
      border-color $cBrand
    .is-invalid &
      border-color $cDanger

  &__field
  &__row
    max-width 500px

  &__field
    position relative
    margin-bottom 35px
    &_img
      flex-direction column
      align-items flex-start
      margin-bottom 60px !important

  &__error
    position absolute
    top calc(100% + 7px)
    left 0
    fontLight()
    font-size 12px
    color $cDanger
    opacity 0
    transition()
    .is-invalid &
      opacity 1

  &__label
    fontLight()
    font-size 15px
    color $cPrimaryText
    white-space nowrap
    .form-app__field_is-active &,
    .form-app__field_sort &
      margin-right 25px
    .form-app__field_news-id &,
    .form-app__field_page-type &
    .form-app__field_active-from &
    .form-app__field_active-to &
      margin-bottom 10px

  &__input
  &__select
  &__pickr
    color $cInfo
    font-size 18px
    >>> input
      font-size 18px
    .is-filled &
      >>> input
        // font-weight 500
        border-color $cBrand
    .is-invalid &
      >>> input
        border-color $cDanger

  &__input
    display block

  &__checkbox
    >>> .el-checkbox__inner
      width 18px
      height 18px
      &:after
        top 3px
        left 6px
</style>