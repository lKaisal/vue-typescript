<template lang="pug">
  include ../../../tools/bemto.pug

  +b.form-banners
    +e.container
      +e.column
        //- file (image)
        +e.field._img.form-field(:class="{ 'is-invalid': isInvalid(fileField), 'is-disabled': allFieldsDisabled }")
          FormImg
          +e.error.form-error(v-html="fileField.errorMsg")
        //- isActive
        transition
          +e.field._is-active.form-field(v-show="isFormEdit && (isInactiveBanner || isDelayedBanner)" @click.stop="isActive = !isActive" :class="{ 'is-invalid': isInvalid(isActiveField), 'is-active': isActive }")
            +e.checkbox.checkbox
              +e.checkbox-icon-wrapper.checkbox-icon-wrapper
                +e.I.checkbox-icon.el-icon-check.checkbox-icon
            +e.LABEL.label(for="isActive" v-html="isActiveLabel")
            +e.error.form-error(v-html="isActiveField.errorMsg")
      +e.column
        //- title
        +e.field._title.form-field(:class="{ 'is-invalid': isInvalid(titleField), 'is-filled': title && !allFieldsDisabled, 'is-disabled': allFieldsDisabled }")
          +e.label.form-label
            +e.LABEL(for="title") Имя баннера
          +e.EL-INPUT.input.form-input(placeholder="Title" v-model="title")
          +e.error.form-error(v-html="titleField.errorMsg")
        //- pageType
        FormPagetype(:key="form.isLoading" :isDisabled="allFieldsDisabled")
        //- activeFrom / activeTo
        FormPickr(:isDisabled="activeFromToDisabled" class="form-banners__pickr")
        //- sort
        +e.field._sort.form-field(v-if="activeAmountValue" :class="{ 'is-invalid': isInvalid(sortField), 'is-filled': sortBy && !sortIsDisabled, 'is-disabled': sortIsDisabled }")
          +e.LABEL.label.form-label(for="sortBy") Положение баннера
          +e.EL-SELECT.select.form-select(:disabled="sortIsDisabled" v-model="sortBy" :placeholder="activeAmountValue.toString()")
            +e.EL-OPTION(v-for="n in activeAmountValue" :key="n" :label="n" :value="n")
          +e.error.form-error(v-html="sortField.errorMsg")
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator'
import { ElInput } from 'element-ui/types/input'
import { MsgBoxContent } from '@/models'
import { Banner, BannerForm, FormField } from '../models'
import { bannersMapper } from '../module/store'
import FormImg from './FormImg.vue'
import { ElSelect } from 'element-ui/types/select'
import FormPagetype from '../components/FormPagetype.vue'
import FormPickr from '../components/FormPickr.vue'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['form', 'activeAmount', 'bannerCurrent']),
    ...bannersMapper.mapGetters(['listActive', 'listDelayed', 'formSort', 'formActiveFrom', 'formActiveTo', 'formAppLink', 'formIsActive', 'formFile', 'formNewsId',
                                 'formPageType', 'formTitle', 'bannerCurrentStatus', 'pageTypesList'])
  },
  methods: {
    ...bannersMapper.mapMutations(['setValidationIsShown']),
    ...bannersMapper.mapActions(['updateField'])
  }
})

@Component({
  components: {
    FormImg,
    FormPagetype,
    FormPickr
  }
})

export default class FormBanners extends Mappers {
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
  get isActive() { return this.isActiveField.value }
  set isActive(value) { this.updateField({name: 'isActive', value}) }
  get sortBy() { return this.isActive || this.isDelayedBanner ? this.sortField.value : null }
  set sortBy(value) { this.isActive || this.isDelayedBanner ? this.updateField({name: 'sort', value: value}) : null }
  get title() { return this.titleField.value }
  set title(value) { this.updateField({name: 'title', value: value.toString().trim() }) }

  // BANNER STATUS
  get isDelayedBanner() { return this.bannerCurrentStatus && this.bannerCurrentStatus === 'delayed' }
  get isActiveBanner() { return this.bannerCurrentStatus && this.bannerCurrentStatus === 'active' }
  get isInactiveBanner() { return this.bannerCurrentStatus && this.bannerCurrentStatus === 'archive' }
  // FORM TYPE
  get isFormCreate() { return this.form.type === 'create' }
  get isFormEdit() { return this.form.type === 'edit' }
  // FORM DISABLED
  get allFieldsDisabled() { return !this.formIsActive.value && !this.isDelayedBanner }
  get sortIsDisabled() { return (!this.formIsActive.value && !this.isDelayedBanner && (!this.activeFromField.value && !this.activeToField.value)) || this.allFieldsDisabled }
  get activeFromToDisabled() { return (this.isDelayedBanner && this.formIsActive.value) || this.sortIsDisabled || this.allFieldsDisabled }
  // FORD ADDITIONAL DATA
  get isActiveLabel() { return this.isFormEdit && this.isDelayedBanner ? 'Активировать сейчас' : 'Активировать' }
  // ACTIVE AMOUNT
  get activeAmountValue() { return this.activeAmount.value }

  @Watch('activeAmountValue', { immediate: true })
  async onActiveAmountChange(val) {
    if (val && !this.sortBy && !this.bannerCurrent.data) this.updateField({name: 'sort', value: val})
  }

  // HOOKS
  created() {
    if (this.isFormCreate) {
      this.updateField({ name: 'isActive', value: true })
    }
  }
  beforeDestroy() {
    this.setValidationIsShown(false)
  }

  // METHODS
  isInvalid(field: FormField) {
    return (this.form.validationIsShown || (field.name === 'file' && field.errorType === 'imgExtension')) && field.validationRequired && !field.isValid && !this.allFieldsDisabled
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

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

  &__pickr
    margin-bottom 35px

  &__field
    position relative
    width-between-property 'margin-bottom' 1441 30 1920 35 true true
    transition()
    &_img
      max-width 550px
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
      align-items center
      padding 5px
      margin -5px
      // margin-bottom 30px
      cursor pointer
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

  &__label
    .form-banners__field_is-active &
      margin-bottom 0
      fontMedium()
      font-size 18px
      pointer-events none

  &__select
    display block

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

<style lang="stylus">
@import '../../../styles/tools'

.form-field
.form-row
  max-width 450px

.form-field
  position relative
  width-between-property 'margin-bottom' 1441 30 1920 35 true true
  transition()
  input
    transition(background-color\, border-color\, color)
  &.is-filled
    input
      border-color $cBrand !important
  &.is-invalid
    input
      border-color $cDanger !important
  &.is-disabled
    pointer-events none
    input
      background-color $cDisabled
      border-color $cLightBorder !important
      color $cPlaceholderText
  &.v-enter
  &.v-leave-to
    opacity 0

.form-label
  display block
  margin-bottom 10px
  fontLight()
  font-size 15px
  color $cPrimaryText
  white-space nowrap
  transition(opacity)

.form-error
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

.form-input-wrapper
  position relative

.form-input
.form-select
.form-pickr
.el-input__inner
  width-between-property 'font-size' 1001 16 1440 18 true true
  >>> input
    width-between-property 'font-size' 1001 16 1440 18 true true

.form-input
.form-pickr
  display block
  .is-invalid &
    animation pulsate ease-in-out .5s both

.form-pickr
  .is-disabled &
    background-color $cDisabled
    border-color $cLightBorder
    color $cPlaceholderText
    transition(background-color\, border-color\, color)

.form-select
  display block
  // +lt-xl()
  //   margin-top 10px

.form-icon-clear
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

.form-comment
  fontLight()
  font-style italic
  font-size 12px
  transition(opacity)
  &.is-transparent
    opacity 0
</style>