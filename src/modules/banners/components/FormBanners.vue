<template lang="pug">
  include ../../../tools/bemto.pug

  +b.form-banners
    +e.container
      +e.column
        //- file (image)
        +e.field._img(:class="{ 'is-invalid': isInvalid(fileField) }")
          DragDrop(class="form-banners__drag-drop")
          +e.error(v-html="fileField.errorMsg")
        //- isActive
        +e.field._is-active(@click.stop="isActive = !isActive" :class="{ 'is-invalid': isInvalid(isActiveField), 'is-active': isActive }")
          +e.checkbox
            +e.I.checkbox-icon.el-icon-check
          +e.LABEL.label(for="isActive") Активировать
          +e.error(v-html="isActiveField.errorMsg")
      +e.column
        //- title
        +e.field._title(:class="{ 'is-invalid': isInvalid(titleField), 'is-filled': title }")
          +e.label
            +e.LABEL(for="title") Имя баннера
          +e.EL-INPUT.input(placeholder="Title" v-model="title")
          +e.error(v-html="titleField.errorMsg")
        //- pageType
        +e.field._page-type(:class="{ 'is-invalid': isInvalid(pageTypeField), 'is-filled': true }")
          +e.label
            +e.LABEL(for="pageType") Тип страницы
          +e.EL-SELECT.select(ref="select" v-model="pageType" :placeholder="pageTypesDisplayed[0]")
            +e.EL-OPTION(v-for="(type, index) in pageTypesDisplayed.length" :key="index" :label="pageTypesDisplayed[index]" :value="index")
          +e.error(v-html="pageTypeField.errorMsg")
        +e.fields
          //- newsId
          +e.field._news-id(v-if="isNewsType" key="newsId" :class="{ 'is-invalid': isInvalid(newsIdField), 'is-filled': newsId }")
            +e.label
              +e.LABEL(for="newsId") Id новости
            +e.EL-INPUT.input(placeholder="111" type="number" v-model="newsId" ref="newsIdRef")
            +e.error(v-html="newsIdField.errorMsg")
          //- appLink
          +e.field._app-link(v-else key="appLink" :class="{ 'is-invalid': isInvalid(appLinkField), 'is-filled': appLink }")
            +e.label
              +e.LABEL(for="appLink") Ссылка на раздел
            +e.EL-INPUT.input(placeholder="/link" v-model="appLink")
            +e.error(v-html="appLinkField.errorMsg")
        //- activeFrom / activeTo
          //- +e.row
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
        //- sort
        +e.field._sort(v-if="activeAmount.value" :class="{ 'is-invalid': isInvalid(sortField), 'is-filled': sortBy && isActive }")
          +e.LABEL.label(for="sortBy") Положение баннера
          +e.EL-SELECT.select(:disabled="!isActive" ref="select" v-model="sortBy" :placeholder="activeAmount.value.toString()")
            +e.EL-OPTION(v-for="n in activeAmount.value" :key="n" :label="n" :value="n")
          +e.error(v-html="sortField.errorMsg")
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator'
import trim from 'validator/lib/trim'
import flatpickr from 'flatpickr'
import { Russian } from 'flatpickr/dist/l10n/ru.js'
import Inputmask from 'inputmask'
import { ElInput } from 'element-ui/types/input'
import { Banner, BannerForm, MsgBoxContent, FormField } from '../models'
import { bannersMapper } from '../module/store'
import DragDrop from './DragDrop.vue'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['form', 'activeAmount']),
    ...bannersMapper.mapGetters(['listActive', 'formSort', 'formActiveFrom', 'formActiveTo', 'formAppLink', 'formIsActive', 'formFile', 'formNewsId', 'formPageType', 'formTitle', 'pageTypesDisplayed'])
  },
  methods: {
    ...bannersMapper.mapMutations(['setValidationIsShown']),
    ...bannersMapper.mapActions(['updateField'])
  }
})

@Component({
  components: {
    DragDrop,
  }
})

export default class FormBanners extends Mappers {
  pickrFrom = null
  pickrTo = null
  dateFormat: string = 'd-m-Y H:i'
  @Ref() fromRef: HTMLElement
  @Ref() toRef: HTMLElement
  @Ref() newsIdRef: ElInput

  // FORM FIELDS
  get activeFromField() { return this.formActiveFrom }
  get activeToField() { return this.formActiveTo }
  get appLinkField() { return this.formAppLink }
  get isActiveField() { return this.formIsActive }
  get fileField() { return this.formFile }
  get newsIdField() { return this.formNewsId }
  get pageTypeField() { return this.formPageType }
  get sortField() { return this.formSort }
  get titleField() { return this.formTitle }

  // FORM SET/GET FIELDS VALUES
  get activeFrom() { return this.pickrFrom && this.pickrFrom.selectedDates.length && this.pickrFrom.formatDate(this.pickrFrom.selectedDates[0], this.dateFormat) }
  set activeFrom(value) { this.updateField({name: 'activeFrom', value}) }
  get activeTo() { return this.pickrTo && this.pickrTo.selectedDates.length && this.pickrTo.formatDate(this.pickrTo.selectedDates[0], this.dateFormat) }
  set activeTo(value) { this.updateField({name: 'activeTo', value}) }
  get appLink() { return this.appLinkField.value }
  set appLink(value) { this.updateField({name: 'appLink', value: trim(value)}) }
  get isActive() { return this.isActiveField.value }
  set isActive(value) { this.updateField({name: 'isActive', value}) }
  get newsId() { return this.newsIdField.value }
  set newsId(value) { this.updateField({name: 'newsId', value: trim(value)}) }
  get pageType() { return this.pageTypeField.value }
  set pageType(value) { this.updateField({name: 'pageType', value: value || 0 }) }
  get sortBy() { return this.isActive ? this.sortField.value : null }
  set sortBy(value) { this.isActive ? this.updateField({name: 'sort', value: value || this.activeAmount.value}) : null }
  get title() { return this.titleField.value }
  set title(value) { this.updateField({name: 'title', value: trim(value)}) }

  // other computed
  get isNewsType() { return this.pageType === 0 }
  get isWrongImgExt() { return this.fileField.errorType === 'img-extension' }
  get activeAmountValue() { return this.activeAmount.value }

  @Watch('activeAmountValue', { immediate: true })
  async onActiveAmount(val) {
    if (val) this.updateField({name: 'sort', value: val})
  }

  async mounted() {
    await this.$nextTick()
    // this.initPickers()
    // this.setInputmasks()
  }
  beforeDestroy() {
    this.setValidationIsShown(false)
  }

  isInvalid(field: FormField) { return (this.form.validationIsShown || (field.name === 'file' && field.errorType === 'img-extension')) && field.validationRequired && !field.isValid }
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
  setInputmasks() {
    // pageType
    const inp = this.newsIdRef.$el.firstElementChild
    const options = {
      regex: '[0-9]*',
      placeholder: '111',
    }

    const inputmask = Inputmask(options).mask(inp)
    console.log(inputmask)
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../../../../node_modules/flatpickr/dist/flatpickr.min.css'

.form-banners

  &__container
    +gt-md()
      display flex
      justify-content space-between

  &__column
    width calc(50% - 30px)

  &__row
    display flex
    justify-content space-between
    flex-wrap wrap
    .form-banners__field
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
    max-width 450px
    &_img
      max-width 550px

  &__field
    position relative
    margin-bottom 35px
    &_img
      flex-direction column
      align-items flex-start
      margin-bottom 60px !important
    &_is-active
      display inline-flex
      padding 5px
      margin -5px
      margin-bottom 30px
      cursor pointer

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
    display block
    margin-bottom 10px
    fontLight()
    font-size 15px
    color $cPrimaryText
    white-space nowrap
    transition(opacity)
    .form-banners__field_is-active &
      // margin-right 25px
      fontMedium()
      font-size 18px
      pointer-events none
      opacity .75
    .form-banners__field_is-active.is-active &
        opacity 1

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

  &__select
    display block
    +lt-xl()
      margin-top 10px

  &__input
    display block
    .is-invalid &
      animation pulsate ease-in-out .5s both

  &__checkbox
    margin-right 15px
    display flex
    justify-content center
    align-items center
    width 18px
    height 18px
    border 1px solid $cBaseBorder
    border-radius 2px
    pointer-events none
    transition(background-color\, border-color)
    >>> i
      font-size 14px
      color transparent
      transform scale(0)
      transition(color\, transform)
    .form-banners__field:hover &
      >>> i
        color $cBrand
        transform scale(.75)
    .is-active &
      background-color $cBrand
      border-color $cBrand
      >>> i
        color white
        transform scale(1)
    .form-banners__field.is-active:hover &
      >>> i
        color white
        transform scale(.75)
</style>