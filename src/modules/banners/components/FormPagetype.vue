<template lang="pug">
  include ../../../tools/bemto.pug

  +b.form-pagetype
    //- pageType
    +e.field.form-field(:class="{ 'is-invalid': isInvalid(pageTypeField), 'is-filled': isFilled, 'is-disabled': isDisabled }")
      +e.label.form-label
        +e.LABEL(for="pageType") Тип страницы
      +e.EL-SELECT.select.form-select(v-show="!isCustomType" ref="pageTypeSelect" v-model="pageType" :disabled="isDisabled" placeholder="Введите тип страницы" @change="onPageTypeSelectChange")
        +e.EL-OPTION.option.form-option(v-for="(type, index) in pageTypesMastered" :key="index" :label="type" :value="type" :class="{ 'is-custom': index === pageTypesMastered.length - 1 }")
      +e.input-wrapper.form-input-wrapper.is-custom(v-show="isCustomType")
        +e.EL-INPUT.input.form-input(ref="pageTypeInput" placeholder="Введите тип страницы" v-model="pageType" @blur="onPageTypeInputBlur")
        +e.I.icon-clear.el-icon-close.form-icon-clear(@click="resetPageType")
      +e.error.form-error(v-html="pageTypeField.errorMsg")
    //- newsId (if pageType === 'news')
    +e.field._news-id.form-field(v-if="isNewsType" key="newsId" :class="{ 'is-invalid': isInvalid(newsIdField), 'is-filled': newsId && !isDisabled, 'is-disabled': isDisabled }")
      +e.label.form-label
        +e.LABEL(for="newsId") Id новости
      +e.EL-INPUT.input.form-input(placeholder="111" type="number" v-model="newsId")
      +e.error.form-error(v-html="newsIdField.errorMsg")
    //- appLink (if pageType !== 'news')
    +e.field._app-link.form-field(v-else key="appLink" :class="{ 'is-invalid': isInvalid(appLinkField), 'is-filled': appLink && !isDisabled, 'is-disabled': isDisabled }")
      +e.label.form-label
        +e.LABEL(for="appLink") Ссылка на раздел
      +e.EL-INPUT.input.form-input(placeholder="/link" v-model="appLink")
      +e.error.form-error(v-html="appLinkField.errorMsg")
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop } from 'vue-property-decorator'
import trim from 'validator/lib/trim'
import { ElInput } from 'element-ui/types/input'
import { Banner, BannerForm, FormField } from '../models'
import { bannersMapper } from '../module/store'
import { ElSelect } from 'element-ui/types/select'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['form']),
    ...bannersMapper.mapGetters(['formPageType', 'formNewsId', 'formAppLink', 'pageTypesList'])
  },
  methods: {
    ...bannersMapper.mapActions(['updateField'])
  }
})

@Component({
})

export default class FormPagetype extends Mappers {
  @Prop() isDisabled: boolean
  @Ref() pageTypeInput: ElInput
  @Ref() pageTypeSelect: ElSelect

  // FORM FIELD
  get appLinkField() { return this.formAppLink }
  get newsIdField() { return this.formNewsId }
  get pageTypeField() { return this.formPageType }

  // FORM SET/GET FIELDS VALUES
  get appLink() { return this.appLinkField.value }
  set appLink(value) { this.updateField({name: 'appLink', value: trim(value)}) }
  get newsId() { return this.newsIdField.value }
  set newsId(value) { this.updateField({name: 'newsId', value: trim(value)}) }
  get pageType() { return this.pageTypeField.value }
  set pageType(value) { this.updateField({name: 'pageType', value: value || ('' && !this.isCustomType && this.pageTypesList[0]) }) }

  get isFilled() { return this.pageType && !this.isDisabled }
  get pageTypesMastered() { return [...this.pageTypesList, 'Добавить тип страницы'] }
  get pageTypeIndex() { return this.pageType && this.pageTypesList.indexOf(this.pageType.toString()) }
  get isNewsType() { return this.pageType === 'news' }
  get isCustomType() { return typeof this.pageTypeIndex !== 'number' || this.pageTypeIndex === this.pageTypesList.length || this.pageTypeIndex < 0 }

  // METHODS
  isInvalid(field: FormField) {
    return this.form.validationIsShown && field.validationRequired && !field.isValid
  }
  // PageType fields
  updatePageType(value) {
    this.updateField({name: 'pageType', value })
  }
  resetPageType() {
    this.updatePageType(this.pageTypesList[0])
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
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.form-pagetype

  &__select
    width 100%

  &__option
    &.is-custom
      position relative
      padding-left 40px
      fontMedium()
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
</style>