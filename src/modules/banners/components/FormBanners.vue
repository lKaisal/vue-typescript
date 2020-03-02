<template lang="pug">
  include ../../../tools/bemto.pug

  +b.form-banners
    +e.container
      +e.column
        //- file (image)
        +e.field._img(:class="{ 'is-invalid': isInvalid(fileField), 'is-disabled': allFieldsDisabled }")
          DragDrop(class="form-banners__drag-drop")
          +e.error(v-html="fileField.errorMsg")
        //- isActive
        transition
          +e.field._is-active(v-show="isFormEdit && (isInactiveBanner || isDelayedBanner)" @click.stop="isActive = !isActive" :class="{ 'is-invalid': isInvalid(isActiveField), 'is-active': isActive }")
            +e.checkbox
              +e.I.checkbox-icon.el-icon-check
            +e.LABEL.label(for="isActive" v-html="isActiveLabel")
            +e.error(v-html="isActiveField.errorMsg")
      +e.column
        //- title
        +e.field._title(:class="{ 'is-invalid': isInvalid(titleField), 'is-filled': title && !allFieldsDisabled, 'is-disabled': allFieldsDisabled }")
          +e.label
            +e.LABEL(for="title") Имя баннера
          +e.EL-INPUT.input(placeholder="Title" v-model="title")
          +e.error(v-html="titleField.errorMsg")
        //- pageType
        +e.field._page-type(:class="{ 'is-invalid': isInvalid(pageTypeField), 'is-filled': pageType && !allFieldsDisabled, 'is-disabled': allFieldsDisabled }")
          +e.label
            +e.LABEL(for="pageType") Тип страницы
          +e.EL-SELECT.select(v-show="!isCustomType" ref="pageTypeSelect" v-model="pageType" :disabled="allFieldsDisabled" placeholder="Введите тип страницы" @change="onPageTypeSelectChange")
            +e.EL-OPTION.option(v-for="(type, index) in pageTypesMastered" :key="index" :label="type" :value="type" :class="{ 'is-custom': index === pageTypesMastered.length - 1 }")
          +e.input-wrapper.is-custom(v-show="isCustomType")
            +e.EL-INPUT.input(ref="pageTypeInput" placeholder="Введите тип страницы" v-model="pageType" @blur="onPageTypeInputBlur")
            +e.I.icon-clear.el-icon-close(@click="resetPageType")
          +e.error(v-html="pageTypeField.errorMsg")
        +e.fields
          //- newsId
          +e.field._news-id(v-if="isNewsType" key="newsId" :class="{ 'is-invalid': isInvalid(newsIdField), 'is-filled': newsId && !allFieldsDisabled, 'is-disabled': allFieldsDisabled }")
            +e.label
              +e.LABEL(for="newsId") Id новости
            +e.EL-INPUT.input(placeholder="111" type="number" v-model="newsId")
            +e.error(v-html="newsIdField.errorMsg")
          //- appLink
          +e.field._app-link(v-else key="appLink" :class="{ 'is-invalid': isInvalid(appLinkField), 'is-filled': appLink && !allFieldsDisabled, 'is-disabled': allFieldsDisabled }")
            +e.label
              +e.LABEL(for="appLink") Ссылка на раздел
            +e.EL-INPUT.input(placeholder="/link" v-model="appLink")
            +e.error(v-html="appLinkField.errorMsg")
        //- activeFrom / activeTo
        +e.block
          +e.row
            +e.field._active-from(:class="{ 'is-invalid': isInvalid(activeFromField), 'is-filled': !!activeFrom, 'is-disabled': activeFromToDisabled }")
              +e.label
                +e.LABEL.label(for="activeFrom") Дата начала
              +e.input-wrapper
                +e.INPUT.pickr.el-input__inner(ref="fromRef" v-model="activeFrom" placeholder="31-12-2020")
                +e.I.icon-clear.el-icon-close(@click="clearPicker(pickrFrom)")
              +e.error(v-html="activeFromField.errorMsg")
            +e.field._active-to(:class="{ 'is-invalid': isInvalid(activeToField), 'is-filled': !!activeTo, 'is-disabled': activeFromToDisabled }")
              +e.label
                +e.LABEL.label(for="activeTo") Дата окончания
              +e.input-wrapper
                +e.INPUT.pickr.el-input__inner(ref="toRef" v-model="activeTo" placeholder="31-12-2020")
                +e.I.icon-clear.el-icon-close(@click="clearPicker(pickrTo)")
              +e.error(v-html="activeToField.errorMsg")
          +e.comment(:class="{ 'is-transparent': isInvalid(activeFromField) || isInvalid(activeToField) }") Заполнить для баннеров с отложенным стартом
        //- sort
        +e.field._sort(v-if="activeAmountValue" :class="{ 'is-invalid': isInvalid(sortField), 'is-filled': sortBy && !sortIsDisabled, 'is-disabled': sortIsDisabled }")
          +e.LABEL.label(for="sortBy") Положение баннера
          +e.EL-SELECT.select(:disabled="sortIsDisabled" v-model="sortBy" :placeholder="activeAmountValue.toString()")
            +e.EL-OPTION(v-for="n in activeAmountValue" :key="n" :label="n" :value="n")
          +e.error(v-html="sortField.errorMsg")
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator'
import trim from 'validator/lib/trim'
import flatpickr from 'flatpickr'
import { Russian } from 'flatpickr/dist/l10n/ru.js'
import { ElInput } from 'element-ui/types/input'
import { MsgBoxContent } from '@/models'
import { Banner, BannerForm, FormField } from '../models'
import { bannersMapper } from '../module/store'
import DragDrop from './DragDrop.vue'
import { ElSelect } from 'element-ui/types/select'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['form', 'activeAmount', 'bannerCurrent', 'pageTypes']),
    ...bannersMapper.mapGetters(['listActive', 'listDelayed', 'formSort', 'formActiveFrom', 'formActiveTo', 'formAppLink', 'formIsActive', 'formFile', 'formNewsId',
                                 'formPageType', 'formTitle', 'bannerCurrentStatus'])
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
  dateFormat: string = 'd-m-Y'
  @Ref() fromRef: HTMLElement
  @Ref() toRef: HTMLElement
  @Ref() pageTypeInput: ElInput
  @Ref() pageTypeSelect: ElSelect

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
  get activeFrom() { return this.activeFromField.value }
  set activeFrom(value) { this.updateField({name: 'activeFrom', value}) }
  get activeTo() { return this.activeToField.value }
  set activeTo(value) { this.updateField({name: 'activeTo', value}) }
  get appLink() { return this.appLinkField.value }
  set appLink(value) { this.updateField({name: 'appLink', value: trim(value)}) }
  get isActive() { return this.isActiveField.value }
  set isActive(value) { this.updateField({name: 'isActive', value}) }
  get newsId() { return this.newsIdField.value }
  set newsId(value) { this.updateField({name: 'newsId', value: trim(value)}) }
  get pageType() { return this.pageTypeField.value }
  set pageType(value) { this.updateField({name: 'pageType', value: value || ('' && !this.isCustomType && this.pageTypes[0]) }) }
  get sortBy() { return this.isActive || this.isDelayedBanner ? this.sortField.value : null }
  set sortBy(value) { this.isActive || this.isDelayedBanner ? this.updateField({name: 'sort', value: value}) : null }
  get title() { return this.titleField.value }
  set title(value) { this.updateField({name: 'title', value: trim(value) }) }

  // BANNER STATUS
  get isDelayedBanner() { return this.bannerCurrentStatus && this.bannerCurrentStatus === 'delayed' }
  get isActiveBanner() { return this.bannerCurrentStatus && this.bannerCurrentStatus === 'active' }
  get isInactiveBanner() { return this.bannerCurrentStatus && this.bannerCurrentStatus === 'archive' }
  // FORM TYPE
  get isFormCreate() { return this.form.type === 'create' }
  get isFormEdit() { return this.form.type === 'edit' }
  // FORM DISABLED
  get allFieldsDisabled() { return !this.formIsActive.value && !this.isDelayedBanner }
  get sortIsDisabled() { return (!this.formIsActive.value && !this.isDelayedBanner && (!this.formActiveFrom.value && !this.formActiveTo.value)) || this.allFieldsDisabled }
  get activeFromToDisabled() { return (this.isDelayedBanner && this.formIsActive.value) || this.sortIsDisabled || this.allFieldsDisabled }
  // FORD ADDITIONAL DATA
  get isActiveLabel() { return this.isFormEdit && this.isDelayedBanner ? 'Активировать сейчас' : 'Активировать' }
  // PAGE TYPE
  get pageTypesMastered() { return [...this.pageTypes, 'Добавить тип страницы'] }
  get pageTypeIndex() { return this.pageType && this.pageTypes.indexOf(this.pageType.toString()) }
  get isNewsType() { return this.pageType === 'news' }
  get isCustomType() { return typeof this.pageTypeIndex !== 'number' || this.pageTypeIndex === this.pageTypes.length || this.pageTypeIndex < 0 }
  // ACTIVE AMOUNT
  get activeAmountValue() { return this.activeAmount.value }

  @Watch('activeAmountValue', { immediate: true })
  async onActiveAmountChange(val) {
    if (val && !this.sortBy && !this.bannerCurrent.data) this.updateField({name: 'sort', value: val})
  }

  // HOOKS
  created() {
    if (this.isFormCreate) this.updateField({ name: 'isActive', value: true })
  }
  async mounted() {
    await this.$nextTick()
    this.initPickers()
  }
  beforeDestroy() {
    this.setValidationIsShown(false)
    if (this.pickrFrom) this.pickrFrom.destroy()
    if (this.pickrTo) this.pickrTo.destroy()
  }

  // METHODS
  isInvalid(field: FormField) {
    return (this.form.validationIsShown || (field.name === 'file' && field.errorType === 'imgExtension')) && field.validationRequired && !field.isValid
  }
  // PageType fields
  updatePageType(value) {
    this.updateField({name: 'pageType', value })
  }
  resetPageType() {
    this.updatePageType(this.pageTypes[0])
  }
  async onPageTypeSelectChange() {
    if (this.isCustomType) {
      this.updatePageType('')
      await this.$nextTick()
      this.pageTypeInput.focus()
    }
  }
  onPageTypeInputBlur() {
    if (!this.pageType) this.resetPageType()
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
    const configTo = Object.assign(configOpts)
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

.form-banners

  &__container
    +gt-md()
      display flex
      justify-content space-between

  &__column
    +gt-md()
      width calc(50% - 30px)
    +lt-md()
      width 100%
      &:not(:last-child)
        margin-bottom 35px

  &__block
    margin-bottom 35px

  &__comment
    fontLight()
    font-style italic
    font-size 12px
    transition(opacity)
    &.is-transparent
      opacity 0

  &__row
    +gt-sm()
      display flex
      justify-content space-between
      flex-wrap nowrap
      .form-banners__field
        &:not(:last-child)
          margin-right 10px

  &__pickr
    z-index 5
    width 100%
    font-size 18px
    fontReg()
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
    width-between-property 'margin-bottom' 1441 30 1920 35 true true
    transition()
    &_img
      flex-direction column
      align-items flex-start
      width-between-property 'margin-bottom' 1441 40 1920 50 true true
      &:before
        z-index 1
        ghost()
        background-color $cBaseBorder
        opacity 0
        transition(opacity)
        pointer-events none
      &.is-disabled
        &:before
          opacity .5
    &_is-active
      display inline-flex
      padding 5px
      margin -5px
      // margin-bottom 30px
      cursor pointer
    &_active-from
    &_active-to
      margin-bottom 7px
    &.is-disabled
      pointer-events none
      >>> input
        background-color $cDisabled
        border-color $cLightBorder
        color $cPlaceholderText
        transition(background-color\, border-color\, color)
    &.v-enter
    &.v-leave-to
      opacity 0

  &__error
    position absolute
    top calc(100% + 7px)
    left 0
    fontLight()
    font-size 12px
    color $cDanger
    opacity 0
    transition()
    +lg()
      top calc(100% + 5px)
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
      margin-bottom 0
      fontMedium()
      font-size 18px
      pointer-events none
      // opacity .75
    // .form-banners__field_is-active.is-active &
    //   opacity 1

  &__input
  &__select
  &__pickr
    // color $cInfo
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

  &__option
    &.is-custom
      position relative
      padding-left 40px
      // color $cBrand
      fontMedium()
      // color $cSecondaryText
      &:before
      &:after
        content ''
        position absolute
        background-color $cPrimaryText
      &:before
        top 50%
        left 20px
        transform translateY(-50%)
        width 11px
        height 1px
      &:after
        top 50%
        left 25px
        transform translateY(-50%)
        width 1px
        height 11px

  &__input
  &__pickr
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

  &__input-wrapper
    position relative

  &__icon-clear
    z-index 1
    position absolute
    top 50%
    transform translateY(-50%)
    right 5px
    padding 5px
    color $cPlaceholderText
    cursor pointer
    pointer-events none
    opacity 0
    transition(opacity)
    .is-filled &
    .is-custom &
      pointer-events auto
      opacity 1
    .is-disabled &
      pointer-events none

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
</style>