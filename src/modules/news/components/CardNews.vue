<template lang="pug">
  include ../../../tools/bemto.pug

  +b.card-news
    +e.H1.title.page-title.card-title Информация о новости
    +e.info-block(v-if="news")
      +e.info
        +e.fields
          +e.block._id
            +e.field._id.card-field
              +e.field-title.card-field-title(v-html="`${fieldId.title}`")
              +e.field-content.card-field-content
                +e.field-content-inner(v-html="fieldId.value")
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
                +e.checkbox.checkbox(:class="{ 'is-active': true, 'is-disabled': field.field === 'published' }")
                  +e.icon-wrapper.checkbox-icon-wrapper
                    +e.I.icon.el-icon-check.checkbox-icon
                  +e.text.checkbox-text(v-html="field.title")
          //- +e.block._texts(v-for="(fields, blockIndex) in textsBlocks" :key="blockIndex")
          FieldsTexts(:fields="textsBlocks")
      //- +e.btns
        ButtonApp(btnType="primary" :isPlain="true" text="Обновить данные" @clicked="emitUpdateIdentity" class="card-news__btn")
        //- ButtonApp(btnType="danger" :isPlain="true" text="Удалить учетную запись" @clicked="emitDeleteIdentity" class="card-news__btn")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import { newsMapper } from '../module/store'
import { News, TableField } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'
import vClickOutside from 'v-click-outside'
import FieldsTexts from '../components/FieldsTexts.vue'

const NewsMappers = Vue.extend({
  computed: {
    // ...newsMapper.mapState(['identity']),
  },
  methods: {
    // ...newsMapper.mapActions(['getIdentity'])
  }
})

@Component({
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    ButtonApp,
    FieldsTexts
  }
})

export default class CardNews extends Mixins(NewsMappers) {
  @Prop() news: News
  @Prop() timer: number

  get fieldId(): TableField {
    return { field: 'id', title: 'ID', value: this.getFieldContent('id') }
  }
  get fieldsDates(): TableField[] {
    return [
      { field: 'created_at', title: 'Дата создания', value: this.getFieldContent('created_at') },
      { field: 'updated_at', title: 'Дата обновления', value: this.getFieldContent('updated_at') }
    ]
  }
  get fieldsPublished(): TableField[] {
    return [
      { field: 'approved', title: 'в приложении', value: this.getFieldContent('approved') },
      { field: 'published', title: 'в  веб-версии', value: this.getFieldContent('published') }
    ]
  }
  get fieldsHeaders(): TableField[] {
    return [
      { field: 'headerMobile', title: 'Заголовок', value: this.getFieldContent('headerMobile') },
      { field: 'header', title: 'Заголовок', value: this.getFieldContent('header') },
    ]
  }
  get fieldsPreviews(): TableField[] {
    return [
      { field: 'previewMobile', title: 'Превью', value: this.getFieldContent('previewMobile') },
      { field: 'preview', title: 'Превью', value: this.getFieldContent('preview') },
    ]
  }
  get fieldsTexts(): TableField[] {
    return [
      { field: 'bodyMobile', title: 'Текст', value: this.getFieldContent('bodyMobile') },
      { field: 'body', title: 'Текст', value: this.getFieldContent('body') },
    ]
  }
  get blocks() {
    return [ this.fieldId, this.fieldsDates, this.fieldsHeaders, this.fieldsPreviews, this.fieldsTexts ]
  }
  get textsBlocks() {
    return [ this.fieldsHeaders, this.fieldsPreviews, this.fieldsTexts ]
  }


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
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.card-news

  &__info-block
    width 100%
    // margin-bottom 50px

  &__block
    margin-bottom 15px

  &__fields
    &_dates
    &_published
      display flex
    &:not(:last-child)
      margin-bottom 25px

  &__field
    &_dates
    &_published
      margin-right 50px
</style>
