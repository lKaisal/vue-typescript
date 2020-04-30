<template lang="pug">
  include ../../../tools/bemto.pug

  +b.card-news
    +e.H1.title.page-title.card-title Информация о новости
    +e.info-block(v-if="news")
      +e.info
        +e.fields
          +e.block._dates
            +e.fields._dates
              +e.field._dates.card-field(v-for="(field, index) in fieldsDates" :key="index")
                +e.field-title.card-field-title(v-html="`${field.title}`")
                +e.field-content.card-field-content
                  +e.field-content-inner(v-html="field.value")
          +e.block._published
            +e.field-title.card-field-title Новость опубликована
            +e.fields._published
              +e.field._published.card-field(v-for="(field, fieldIndex) in fieldsPublished")
                +e.icon-wrapper.checkbox-icon-wrapper
                  +e.I.icon.checkbox-icon(:class="{'el-icon-check': field.value, 'el-icon-close': !field.value}")
                +e.text.field-content(v-html="field.title")
          BlockTexts(:fields="fieldsTexts" @editModeIsOn="editMode=true" @editModeIsOff="editMode=false" class="card-news__block card-news__block_texts")
      +e.btns.card-btns
        ButtonApp(v-show="!editMode" btnType="primary" :isPlain="true" :text="!newsIsPublished ? 'Опубликовать новость' : 'Обновить новость'"
          @clicked="submitPublish" class="card-news__btn card-btn")
        //- ButtonApp(btnType="warning" :isPlain="true" text="Отменить изменения" @clicked="resetChanges" class="card-news__btn")
        ButtonApp(v-show="newsIsPublished && !editMode" btnType="danger" :isPlain="true" text="Снять с публикации" @clicked="submitDelete" class="card-news__btn")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import { newsMapper } from '../module/store'
import { News, TableField } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'
import vClickOutside from 'v-click-outside'
import BlockTexts from '../components/BlockTexts.vue'

const NewsMappers = Vue.extend({
  computed: {
    // ...newsMapper.mapState(['identity']),
  },
  methods: {
    ...newsMapper.mapMutations(['setTextsForPublish', 'resetTextsForEdit'])
  }
})

@Component({
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    ButtonApp,
    BlockTexts
  }
})

export default class CardNews extends Mixins(NewsMappers) {
  @Prop() news: News

  editMode: boolean = false

  get newsIsPublished() { return this.news.approved }
  get fieldId(): TableField {
    return { field: 'id', title: 'ID', value: this.getFieldContent('id') }
  }
  get fieldsDates(): TableField[] {
    return [
      this.fieldId,
      { field: 'created_at', title: 'Дата создания', value: this.getFieldContent('created_at') },
      { field: 'updated_at', title: 'Дата обновления', value: this.getFieldContent('updated_at') }
    ]
  }
  get fieldsPublished(): TableField[] {
    return [
      { field: 'approved', title: 'в приложении', value: this.getFieldContent('approved') },
      { field: 'published', title: 'в  веб-версии', value: this.getFieldContent('published') },
      // { field: 'pushed', title: 'отправлено push-уведомление', value: this.getFieldContent('pushed') }
    ]
  }
  get fieldsTexts() {
    return [
      [
        { field: 'headerMobile', title: 'Заголовок', value: this.getFieldContent('headerMobile') },
        { field: 'previewMobile', title: 'Превью', value: this.getFieldContent('previewMobile') },
        { field: 'bodyMobile', title: 'Текст', value: this.getFieldContent('bodyMobile') },
      ],
      [
        { field: 'header', title: 'Заголовок', value: this.getFieldContent('header') },
        { field: 'preview', title: 'Превью', value: this.getFieldContent('preview') },
        { field: 'body', title: 'Текст', value: this.getFieldContent('body') },
      ]
    ]}

  getFieldContent(field: keyof News) {
    if (!this.news) return

    const value = this.news[field]
    const isDateField = field === 'created_at' || field === 'updated_at'
    const isHeader = field === 'headerMobile'
    const isPreview = field === 'previewMobile'
    const isBody = field === 'bodyMobile'

    if (isDateField) {
      const date = value.toString().match(/[^\s]+/)[0]
      const year = Number(date.split('-')[2])

      return year < 2000 ? '-' : date
    }
    else if (isHeader && !value) return this.news['header']
    else if (isPreview && !value) return this.news['preview']
    else if (isBody && !value) return this.news['body']
    else return value
  }
  submitPublish() {
    this.$emit('submitPublish')
  }
  submitDelete() {
    this.$emit('submitDelete')
  }
  resetChanges() {
    // @ts-ignore
    // this.setTextsForPublish(this.fieldsTexts[0])
    this.resetTextsForEdit()
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.card-news

  &__info-block
    width 100%

  &__btns
    margin-top 30px
    margin-left 0

  &__block
    &:not(:last-child)
      margin-bottom 30px

  &__fields
    &_dates
    &_published
      +gt-sm()
        display flex
        flex-wrap wrap

  &__field
    &_published
      display flex
      flex-wrap nowrap
    &_dates
    &_published
      width-between-property 'margin-right' 601 25 1000 50 true true
      margin-bottom 0
      +lt-md()
        margin-bottom 5px

  &__text
    white-space nowrap

  &__icon-wrapper
    margin-right 5px
    display flex
    align-items center
    justify-content center
    border none

  &__icon
    transform none
    &.el-icon-close
      color $cDanger
    &.el-icon-check
      color $cBrand

  &__tabs
    z-index 5
    display flex
    transform translateY(1px)

  &__tab
    margin-bottom 0
    position relative
    padding 10px
    border 1px solid $cLightBorder
    background-color $cDisabled
    user-select none
    cursor pointer
    transition(opacity\, background-color\, color\, border-color\, box-shadow)
    &:first-child
      border-radius 4px 0 0 0
    &:last-child
      border-radius 0 4px 0 0
    &:hover
      color $cBrandMedium
    &:not(:last-child)
      border-right none
    &.is-active
      color $cBrand !important
      border-color $cLightBorder $cLightBorder white $cLightBorder
      box-shadow 0px -4px 12px -2px rgba(0,0,0,0.1)
      background-color white

  &__btns
    display flex
    flex-wrap wrap

  &__btn
    margin-right 10px
    margin-bottom 10px
</style>
