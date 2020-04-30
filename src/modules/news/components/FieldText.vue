<template lang="pug">
  include ../../../tools/bemto.pug

  +b.field-text
    +e.container
      +e.title.card-field-title(v-html="field.title")
      +e.content.card-field-content(:style="setContentStyle()" tag="div")
        transition
          +e.content-inner._main(v-if="!editMode && (inputHeight || isEditorField)" key="main" v-html="editableText")
          +e.EL-INPUT.content-inner._input(v-else-if="(editMode || !inputHeight) && !isEditorField" key="input" ref="inputRef" v-model="editableText" clearable
            :placeholder="field.title" @input="emitInputChange")
        +e.content-inner._editable#editor-field(v-if="isEditorField" v-html="editorHtmlTextInitial" key="editable" :class="{ 'is-transparent': !editMode }")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch, Ref } from 'vue-property-decorator'
import { News, TableField, TextForPublish } from '../models'
import FroalaEditor from 'froala-editor'
import { uiMapper } from '@/services/store/modules/ui/store'
import { newsMapper } from '../module/store'

const NewsMappers = Vue.extend({
  // computed: {
  //   ...newsMapper.mapState(['textsForPublish'])
  // },
  // methods: {
  //   ...newsMapper.mapMutations(['setTextsForPublish', 'updateTextForPublish'])
  // }
})

const UiMappers = Vue.extend({
  computed: {
    ...uiMapper.mapState(['breakpoint'])
  }
})

@Component({
})

export default class FieldText extends Mixins(UiMappers, NewsMappers) {
  @Prop() field: TextForPublish
  @Prop() editMode: boolean
  @Prop() isEditorField: boolean
  @Ref() inputRef

  breakpoint!: string
  froala = null
  editableText: string = null // мутируемый текст для отображения в статичном поле (любого, в т.ч. редактора) и в инпутах (не редакторе)
  editorHtmlTextInitial: string = null // текст для инициализации редактора - объявляется один раз при создании объекта и больше не меняется
  inputHeight: number = null

  get isLtMd() { return this.breakpoint === 'xs' || this.breakpoint === 'sm' }
  get fieldTitle() { return this.field.title }
  get fieldValue() { return this.field.value }
  get configToolbarButtons() {
    if (!this.isLtMd) { 
      return {
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
      }
    } else {
      return {
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
      }
    }
  }
  get configQuickInsertOptions() {
    if (!this.isLtMd) return ['image', 'embedly', 'table', 'ul', 'ol', 'hr']
    else return null
  }
  get config() {
    return {
      charCounterCount: false,
      language: 'ru',
      quickInsertButtons: this.configQuickInsertOptions,
      keepFormatOnDelete: true,
      linkEditButtons: ['linkOpen', 'linkEdit', 'linkRemove'],
      toolbarButtons: this.configToolbarButtons,
      events: {
        'contentChanged': () => {
          this.onEditorInputChange()
        }
      }
    }
  }

  // @Watch('fieldTitle')
  // async onFieldTitleChange(val) {
  //   this.destroyEditor()
  //   this.inputHeight = null
  //   this.editableText = this.field.value.toString()
  //   await this.$nextTick()
  //   if (this.isEditorField) this.initEditor()
  //   else this.getInputHeight()
  // }
  @Watch('fieldValue')
  async onFieldChange(val) {
    if (val !== this.editableText) {
      // this.inputHeight = null
      // this.editableText = this.field.value.toString()
      // await this.$nextTick()
      // this.getInputHeight()
      this.inputHeight = null
      if (!this.isEditorField) {
        this.editableText = val
        await this.$nextTick()
        this.getInputHeight()
      } else {
        this.editableText = val
        this.froala.html.set(val)
      }
    }
  }
  @Watch('editMode')
  async onEditModeChange(val) {
    if (val && this.isEditorField && !this.froala) {
      await this.$nextTick()
      this.initEditor()
    }
    if (!val && this.isEditorField) {
      if (this.froala.html.get() !== this.field.value) {
        // this.destroyEditor()
        this.editableText = this.field.value.toString()
        this.froala.html.set(this.field.value)
        await this.$nextTick()
        // this.initEditor()
      } else if (this.editableText !== this.fieldValue) {
        // this.destroyEditor()
        this.editableText = this.field.value
        await this.$nextTick()
        // this.initEditor()
      }
    }
  }

  async mounted() {
    this.editableText = this.field.value.toString()
    this.editorHtmlTextInitial = this.field.value.toString()
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
  async onEditorInputChange() {
    await this.$nextTick()
    const html = this.froala.html.get()
    this.editableText = html
    this.emitInputChange()
  }
  emitInputChange() {
    const value = this.editableText
    this.$emit('inputChange', value, this.field.field)
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
