<template lang="pug">
  include ../../../tools/bemto.pug

  +b.field-text
    +e.container
      +e.title.card-field-title(v-html="field.title")
      +e.TRANSITION-GROUP.content.card-field-content(:style="setContentStyle()" tag="div")
        +e.content-inner._main(v-if="!editMode && (inputHeight || isEditorField)" key="main" v-html="editableText")
        +e.EL-INPUT.content-inner._input(v-else-if="(editMode || !inputHeight) && !isEditorField" key="input" ref="inputRef" v-model="editableText" clearable
          :placeholder="field.title" @input="emitInputChange")
        +e.content-inner._editable#editor-field(v-if="isEditorField" v-html="editableText" key="editable" :class="{ 'is-transparent': !editMode }")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch, Ref } from 'vue-property-decorator'
import { News, TableField, TextPublished } from '../models'
import FroalaEditor from 'froala-editor'
import { uiMapper } from '@/services/store/modules/ui/store'
import { newsMapper } from '../module/store'

const NewsMappers = Vue.extend({
  computed: {
    ...newsMapper.mapState(['textsPublished'])
  },
  methods: {
    ...newsMapper.mapMutations(['setTextPublished', 'updateTextPublished'])
  }
})

const UiMappers = Vue.extend({
  computed: {
    ...uiMapper.mapState(['breakpoint'])
  }
})

@Component({
})

export default class FieldText extends Mixins(UiMappers, NewsMappers) {
  @Prop() field: TextPublished
  @Prop() editMode: boolean
  @Prop() isEditorField: boolean
  @Ref() inputRef

  breakpoint!: string
  froala = null
  editableText: string = null
  editorHtmlText: string = null
  inputHeight: number = null

  get isLtMd() { return this.breakpoint === 'xs' || this.breakpoint === 'sm' }
  get config() {
    if (!this.isLtMd) {
      return {
        charCounterCount: false,
        language: 'ru',
        quickInsertButtons: ['image', 'embedly', 'table', 'ul', 'ol', 'hr'],
        keepFormatOnDelete: true,
        linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
        toolbarButtons: {
          'moreText': {
            'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'clearFormatting'],
          },
          'moreParagraph': {
            'buttons': ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'lineHeight', 'outdent', 'indent'],
          },
          'moreRich': {
            'buttons': ['insertLink', 'insertImage', 'specialCharacters', 'insertHR'],
          },
          'moreMisc': {
            'buttons': ['undo', 'redo', 'selectAll', 'print', 'fullscreen'],
            'align': 'right',
          }
        },
        events: {
          'contentChanged': () => {
            this.onEditorInputChange()
          }
        }
      }
    } else {
      return {
        charCounterCount: false,
        language: 'ru',
        quickInsertButtons: null,
        keepFormatOnDelete: true,
        linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
        toolbarButtons: {
          'moreText': {
            'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'clearFormatting'],
            'buttonsVisible': 0
          },
          'moreParagraph': {
            'buttons': ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'lineHeight', 'outdent', 'indent'],
            'buttonsVisible': 0
          },
          'moreRich': {
            'buttons': ['insertLink', 'insertImage', 'specialCharacters', 'insertHR'],
            'buttonsVisible': 0
          },
          'moreMisc': {
            'buttons': ['undo', 'redo', 'selectAll', 'print', 'fullscreen'],
            'align': 'right',
            'buttonsVisible': 0
          }
        },
        events: {
          'contentChanged': () => {
            this.onEditorInputChange()
          }
        }
      }
    }
  }

  async mounted() {
    this.editableText = this.field.value.toString()
    await this.$nextTick()
    if (this.isEditorField) this.initEditor()
    else this.getInputHeight()
  }

  async getInputHeight() {
    const ref = this.inputRef
    if (ref) this.inputHeight = ref.$el ? ref.$el.firstElementChild.offsetHeight : ref.offsetHeight
  }
  initEditor() {
    this.froala = new FroalaEditor('#editor-field', this.config)
  }
  destroyEditor() {
    if (this.froala) {
      this.froala.destroy()
      this.froala = null
    }
  }
  setContentStyle() {
    if (!this.inputHeight) return

    return `height: ${this.inputHeight}px;`
  }
  onEditorInputChange() {
    const html = this.froala.html.get()
    // if (!html) this.froala.html.set('<a></a>')
    this.editorHtmlText = html
    this.emitInputChange()
  }
  emitInputChange() {
    // this.$emit('inputChange', this.editableText, this.field.field)
    const value = this.isEditorField ? this.editorHtmlText : this.editableText
    this.updateTextPublished({field: this.field.field, value})
  }
}
</script>

<style lang="stylus">
@import '../../../styles/tools'

.fr-box.fr-basic
  border 1px solid $cLightBorder
  border-radius 4px

.fr-toolbar.fr-top,
.fr-box .fr-wrapper,
.fr-box.fr-basic .fr-wrapper
  border none !important

.fr-box.fr-basic .fr-element
  font-family inherit
  font-size inherit
  color inherit

.fr-toolbar .fr-command.fr-btn
  margin 0 !important

.fr-toolbar .fr-command.fr-btn svg.fr-svg
  height 18px !important

.fr-toolbar .fr-more-toolbar.fr-expanded
  height 40px !important

.fr-wrapper
  padding-top 15px

.second-toolbar
  display none

</style>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.field-text

  &__container
    transition(opacity)
    transition-duration 5s
    &.v-enter
    &.v-leave-to
      opacity 0

  &__content
    position relative
    font-size 14px

  &__content-inner
    line-height 1.5 !important
    fontReg()
    transition(opacity)
    transition-duration $tFast
    &_main
    &_input
      position absolute
      top 0
      right 0
      bottom 0
      left 0
    &_editable
      width 100%
      padding 10px
      border 1px solid $cLighterBorder
      border-radius 4px
    &.is-transparent
      z-index -1
      opacity 0
      pointer-events none
    &.v-enter
    &.v-leave-to
      opacity 0
    >>> input
      font-size 14px
    >>> p
      line-height 1.5 !important
      fontReg()
    >>> span
      line-height 1.5 !important
      font inherit !important
</style>
