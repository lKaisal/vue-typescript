<template lang="pug">
  include ../../../tools/bemto.pug

  +b.form-banners
    +e.container
      +e.column
        //- file (image)
        +e.field._img(:class="{ 'is-invalid': isInvalid(fileField), 'is-disabled': allFieldsDisabled }")
          DragDrop(class="form-banners__drag-drop")
          +e.error.form-error(v-html="fileField.errorMsg")
        //- isActive
        transition
          +e.field._is-active(v-show="isFormEdit && (isInactiveBanner || isDelayedBanner)" @click.stop="isActive = !isActive" :class="{ 'is-invalid': isInvalid(isActiveField), 'is-active': isActive }")
            +e.checkbox
              +e.I.checkbox-icon.el-icon-check
            +e.LABEL.label(for="isActive" v-html="isActiveLabel")
            +e.error.form-error(v-html="isActiveField.errorMsg")
      +e.column
        //- title
        +e.field._title(:class="{ 'is-invalid': isInvalid(titleField), 'is-filled': title && !allFieldsDisabled, 'is-disabled': allFieldsDisabled }")
          +e.label.form-label
            +e.LABEL(for="title") Имя баннера
          +e.EL-INPUT.input.form-input(placeholder="Title" v-model="title")
          +e.error.form-error(v-html="titleField.errorMsg")
        //- pageType
        FormPagetype(:isDisabled="allFieldsDisabled")
        //- newsId (if pageType === 'news')
        +e.field._news-id(v-if="isNewsType" key="newsId" :class="{ 'is-invalid': isInvalid(newsIdField), 'is-filled': newsId && !allFieldsDisabled, 'is-disabled': allFieldsDisabled }")
          +e.label.form-label
            +e.LABEL(for="newsId") Id новости
          +e.EL-INPUT.input.form-input(placeholder="111" type="number" v-model="newsId")
          +e.error.form-error(v-html="newsIdField.errorMsg")
        //- appLink (if pageType !== 'news')
        +e.field._app-link(v-else key="appLink" :class="{ 'is-invalid': isInvalid(appLinkField), 'is-filled': appLink && !allFieldsDisabled, 'is-disabled': allFieldsDisabled }")
          +e.label.form-label
            +e.LABEL(for="appLink") Ссылка на раздел
          +e.EL-INPUT.input.form-input(placeholder="/link" v-model="appLink")
          +e.error.form-error(v-html="appLinkField.errorMsg")
        //- activeFrom / activeTo
        FormPickr(:isDisabled="activeFromToDisabled" class="form-banners__pickr")
        //- sort
        +e.field._sort(v-if="activeAmountValue" :class="{ 'is-invalid': isInvalid(sortField), 'is-filled': sortBy && !sortIsDisabled, 'is-disabled': sortIsDisabled }")
          +e.LABEL.label.form-label(for="sortBy") Положение баннера
          +e.EL-SELECT.select(:disabled="sortIsDisabled" v-model="sortBy" :placeholder="activeAmountValue.toString()")
            +e.EL-OPTION(v-for="n in activeAmountValue" :key="n" :label="n" :value="n")
          +e.error.form-error(v-html="sortField.errorMsg")
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator'
import trim from 'validator/lib/trim'
import { ElInput } from 'element-ui/types/input'
import { MsgBoxContent } from '@/models'
import { Banner, BannerForm, FormField } from '../models'
import { bannersMapper } from '../module/store'
import DragDrop from './DragDrop.vue'
import { ElSelect } from 'element-ui/types/select'
import FormPagetype from '../components/FormPagetype.vue'
import FormPickr from '../components/FormPickr.vue'

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
  get sortIsDisabled() { return (!this.formIsActive.value && !this.isDelayedBanner && (!this.activeFromField.value && !this.activeToField.value)) || this.allFieldsDisabled }
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