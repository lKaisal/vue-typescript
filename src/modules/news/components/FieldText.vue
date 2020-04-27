<template lang="pug">
  include ../../../tools/bemto.pug

  +b.field-text
    +e.container(v-if="!editMode")
      +e.title.card-field-title(v-html="field.title")
      +e.content.card-field-content
        +e.content-inner(v-html="field.value")
    +e.container(v-else)
      +e.title.card-field-title(v-html="field.title")
      +e.content.card-field-content
        +e.EL-INPUT.content-inner(v-if="!isEditorField" v-model="editableText" clearable :placeholder="field.title")
        +e.FROALA.content-inner#editor-field(v-else tag="textarea" :config="config" v-model="editableText")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { News, TableField } from '../models'
import VueFroala from 'vue-froala-wysiwyg'
import { uiMapper } from '@/services/store/modules/ui/store'

const UiMappers = Vue.extend({
  computed: {
    ...uiMapper.mapState(['breakpoint'])
  }
})

@Component({
})

export default class FieldText extends Mixins(UiMappers) {
  @Prop() field: TableField
  @Prop() editMode: boolean
  @Prop() isEditorField: boolean

  breakpoint!: string
  froala = null
  editableText: string = null

  get isLtMd() { return this.breakpoint === 'xs' || this.breakpoint === 'sm' }
  get config() {
    if (!this.isLtMd) {
      return {
        charCounterCount: false,
        language: 'ru',
        quickInsertButtons: ['image', 'embedly', 'table', 'ul', 'ol', 'hr'],
        linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
        toolbarButtons: {
          'moreText': {
            'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontSize', 'textColor', 'backgroundColor', 'clearFormatting'],
          },
          'moreParagraph': {
            'buttons': ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'lineHeight', 'outdent', 'indent'],
          },
          'moreRich': {
            'buttons': ['insertLink', 'insertImage', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertHR'],
          },
          'moreMisc': {
            'buttons': ['undo', 'redo', 'selectAll', 'print', 'fullscreen'],
            'align': 'right',
          }
        },
      }
    } else {
      return {
        charCounterCount: false,
        language: 'ru',
        quickInsertButtons: null,
        linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
        toolbarButtons: {
          'moreText': {
            'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontSize', 'textColor', 'backgroundColor', 'clearFormatting'],
            'buttonsVisible': 0
          },
          'moreParagraph': {
            'buttons': ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'lineHeight', 'outdent', 'indent'],
            'buttonsVisible': 0
          },
          'moreRich': {
            'buttons': ['insertLink', 'insertImage', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertHR'],
            'buttonsVisible': 0
          },
          'moreMisc': {
            'buttons': ['undo', 'redo', 'selectAll', 'print', 'fullscreen'],
            'align': 'right',
            'buttonsVisible': 0
          }
        },
      }
    }
  }

  mounted() {
    this.editableText = this.field.value.toString()
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.field-text

  &__content
    font-size 14px

  &__content-inner
    line-height 1.5 !important
    fontReg()
    >>> p
      line-height 1.5 !important
      fontReg()
    >>> span
      line-height 1.5 !important
      font inherit !important
</style>
