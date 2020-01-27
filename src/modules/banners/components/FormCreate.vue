<template lang="pug">
  include ../../../tools/bemto.pug

  +b.form-create
    +e.field._img(:class="{ 'is-invalid': isInvalid(fileField) }")
      DragDrop(class="form-create__drag-drop")
      +e.error(v-html="fileField.errorMsg")
    +e.field._news-id(:class="{ 'is-invalid': isInvalid(newsIdField), 'is-filled': newsId }")
      +e.label
        +e.LABEL(for="newsId") Id новости
      +e.EL-INPUT.input(placeholder="7777777" v-model="newsId")
      +e.error(v-html="newsIdField.errorMsg")
    +e.field._page-type(:class="{ 'is-invalid': isInvalid(pageTypeField), 'is-filled': !!pageType }")
      +e.label
        +e.LABEL(for="pageType") Тип страницы
      +e.EL-INPUT.input(placeholder="type" v-model="pageType")
      +e.error(v-html="pageTypeField.errorMsg")
    +e.field._is-active(:class="{ 'is-invalid': isInvalid(isActiveField) }")
      +e.LABEL.label(for="isActive") Показывать в приложении
      +e.EL-CHECKBOX.checkbox(v-model="isActive")
      +e.error(v-html="isActiveField.errorMsg")
      +e.LABEL.label(for="sortBy") Положение баннера
      +e.EL-SELECT.select(ref="select" v-model="sortBy" :placeholder="(maxSortBy + 1).toString()")
        +e.EL-OPTION(v-for="n in maxSortBy + 1" :key="n" :label="n" :value="n")
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import trim from 'validator/lib/trim'
import { Banner, BannerForm, MsgBoxContent, FormField } from '../models'
import DragDrop from './DragDrop.vue'
import { bannersMapper } from '../module/store'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['form']),
    ...bannersMapper.mapGetters([
      'listSorted',
      'formIsActive',
      'formFile',
      'formNewsId',
      'formPageType',
      'formSort',
    ])
  },
  methods: {
    ...bannersMapper.mapMutations([
      'clearForm',
      'setValidationIsShown',
      'updateField'
    ])
  }
})

@Component({
  components: {
    DragDrop
  }
})

export default class FormCreate extends Mappers {
  get list() { return this.listSorted }
  get maxSortBy() { return this.list.length }

  // FORM FIELDS
  get isActiveField() { return this.formIsActive }
  get fileField() { return this.formFile }
  get newsIdField() { return this.formNewsId }
  get pageTypeField() { return this.formPageType }
  get sortByField() { return this.formSort }

  // FORM SET/GET FIELDS VALUES
  get isActive() { return this.isActiveField.value }
  set isActive(value) { this.updateField({name: 'isActive', value}) }
  get newsId() { return this.newsIdField.value }
  set newsId(value) { this.updateField({name: 'newsId', value: trim(value)}) }
  get pageType() { return this.pageTypeField.value }
  set pageType(value) { this.updateField({name: 'pageType', value: trim(value)}) }
  get sortBy() { return this.sortByField.value }
  set sortBy(value) { this.updateField({name: 'sort', value}) }

  created() {
    this.clearForm()
  }

  beforeDestroy() {
    this.setValidationIsShown(false)
  }

  // FORM METHODS
  isInvalid(field: FormField) { return this.form.validationIsShown && field.validationRequired && !field.isValid }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.form-create

  &__field
    &:not(:last-child)
      margin-bottom 35px

  &__field
    position relative
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
    .form-create__field_is-active &,
    .form-create__field_sort &
      margin-right 25px
    .form-create__field_news-id &,
    .form-create__field_page-type &
      margin-bottom 10px

  &__input
  &__select
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