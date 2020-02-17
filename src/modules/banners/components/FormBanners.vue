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
        +e.field._is-active(v-if="isFormEdit" @click.stop="isActive = !isActive" :class="{ 'is-invalid': isInvalid(isActiveField), 'is-active': isActive }")
          +e.checkbox
            +e.I.checkbox-icon.el-icon-check
          +e.LABEL.label(for="isActive" v-html="isActiveLabel")
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
        +e.field._sort(v-if="activeAmount.value" :class="{ 'is-invalid': isInvalid(sortField), 'is-filled': sortBy && !sortIsDisabled }")
          +e.LABEL.label(for="sortBy") Положение баннера
          +e.EL-SELECT.select(:disabled="sortIsDisabled" ref="select" v-model="sortBy" :placeholder="activeAmount.value.toString()")
            +e.EL-OPTION(v-for="n in activeAmount.value" :key="n" :label="n" :value="n")
          +e.error(v-html="sortField.errorMsg")
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator'
import trim from 'validator/lib/trim'
import flatpickr from 'flatpickr'
import { Russian } from 'flatpickr/dist/l10n/ru.js'
import { ElInput } from 'element-ui/types/input'
import { Banner, BannerForm, MsgBoxContent, FormField } from '../models'
import { bannersMapper } from '../module/store'
import DragDrop from './DragDrop.vue'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['form', 'activeAmount']),
    ...bannersMapper.mapGetters(['listActive', 'listDelayed', 'formSort', 'formActiveFrom', 'formActiveTo', 'formAppLink', 'formIsActive', 'formFile', 'formNewsId',
                                 'formPageType', 'formTitle', 'pageTypesDisplayed' ,'bannerCurrentMastered'])
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
  set pageType(value) { this.updateField({name: 'pageType', value: value || 0 }) }
  get sortBy() { return this.sortField.value }
  set sortBy(value) { this.updateField({name: 'sort', value: value || this.activeAmount.value}) }
  get title() { return this.titleField.value }
  set title(value) { this.updateField({name: 'title', value: trim(value) }) }

  // other computed
  get isFormCreate() { return this.form.type === 'create' }
  get isFormEdit() { return this.form.type === 'edit' }

  get isActiveBanner() { return this.isFormEdit && this.bannerCurrentMastered.type === 'active' }
  get isDelayedBanner() { return this.isFormEdit && this.bannerCurrentMastered.type === 'delayed' }
  get isInactiveBanner() { return this.isFormEdit && this.bannerCurrentMastered.type === 'inactive' }

  get isActiveLabel() { return this.isFormEdit && this.isDelayedBanner ? 'Активировать сейчас' : 'Активировать' }
  get isNewsType() { return this.pageType === 0 }
  get isWrongImgExt() { return this.fileField.errorType === 'imgExtension' }
  get activeAmountValue() { return this.activeAmount.value }
  get sortIsDisabled() { return !this.isActive && (this.isInactiveBanner || !this.activeFrom || !this.activeTo) }
  get activeFromToDisabled() { return this.isDelayedBanner && this.isActive }

  @Watch('activeAmountValue', { immediate: true })
  async onActiveAmountChange(val) {
    if (val && !this.sortBy && !this.bannerCurrentMastered) this.updateField({name: 'sort', value: val})
  }

  created() {
    if (this.isFormCreate) this.updateField({ name: 'isActive', value: true })
  }
  async mounted() {
    await this.$nextTick()
    this.initPickers()
  }
  beforeDestroy() {
    this.setValidationIsShown(false)
  }

  isInvalid(field: FormField) { return (this.form.validationIsShown || (field.name === 'file' && field.errorType === 'imgExtension')) && field.validationRequired && !field.isValid }
  initPickers() {
    const configOpts = { 'locale': Russian, dateFormat: this.dateFormat, minDate: new Date() }

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
    width calc(50% - 30px)

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
    margin-bottom 35px
    &_img
      flex-direction column
      align-items flex-start
      margin-bottom 60px !important
    &_is-active
      display inline-flex
      padding 5px
      margin -5px
      // margin-bottom 30px
      cursor pointer
    &_active-from
    &_active-to
      margin-bottom 7px

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
      opacity .75
    .form-banners__field_is-active.is-active &
      opacity 1

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
    .is-disabled &
      pointer-events none
      >>> input
        background-color $cDisabled
        border-color $cLightBorder
        color $cPlaceholderText
        transition(background-color\, border-color\, color)

  &__icon-clear
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