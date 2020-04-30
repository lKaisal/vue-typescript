<template lang="pug">
  include ../../../tools/bemto.pug

  +b.block-texts
    +e.container
      +e.tabs
        +e.tab.card-field-title(v-for="(tab, index) in tabs" :key="index" v-html="tab" @click="setActiveIndex(index)"
          :class="{ 'is-active': activeIndex === index, 'is-disabled': editMode && activeIndex !== index }")
      +e.fields
        +e.edit-icons.card-btn-close(v-if="activeIndex === 0")
          +e.edit-icon-wrapper(v-if="!editMode" @click="turnOnEditMode")
            +e.edit-icon.el-icon-edit
            +e.icon-tooltip Редактировать новость
          +e.edit-icon-wrapper(v-if="editMode" @click="confirmEdit")
            +e.edit-icon.el-icon-check
            +e.icon-tooltip Сохранить изменения
          +e.edit-icon-wrapper._reset(v-if="editMode" @click="onResetClick")
            +e.edit-icon.el-icon-refresh
            +e.icon-tooltip Отменить изменения
          +e.edit-icon-wrapper._close(v-if="editMode" @click="onCloseClick")
            +e.edit-icon.el-icon-close
            +e.icon-tooltip Отменить и закрыть
        FieldText(v-for="(field, index) in activeEditableFields" :key="index" :editMode="editMode" :isEditorField="index === 2"
          :field="field" @inputChange="onInputChange" class="block-texts__field")
      +e.btns.card-btns(v-show="editMode")
        ButtonApp(v-show="editMode" btnType="primary" :isPlain="true" text="Сохранить изменения"
          @clicked="confirmEdit" class="block-texts__btn card-btn")
        ButtonApp(btnType="warning" :isPlain="true" text="Сбросить изменения" @clicked="onResetClick" class="block-texts__btn card-btn")
        ButtonApp(btnType="danger" :isPlain="true" text="Отменить редактирование" @clicked="onCloseClick" class="block-texts__btn card-btn")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import { News, TextForPublish, TableField } from '../models'
import FieldText from '../components/FieldText.vue'
import { newsMapper } from '../module/store'
import ButtonApp from '@/components/ButtonApp.vue'

const NewsMappers = Vue.extend({
  computed: {
    ...newsMapper.mapState(['textsForPublish', 'textsForEdit'])
  },
  methods: {
    ...newsMapper.mapMutations(['setTextsForPublish', 'updateTextForPublish', 'setTextsForEdit', 'resetTextsForEdit', 'updateTextForEdit'])
  }
})

@Component({
  components: {
    FieldText,
    ButtonApp
  }
})

export default class BlockTexts extends Mixins(NewsMappers) {
  @Prop() fields: (TableField[])[]

  tabs = ['Мобильное приложение', 'Веб-версия']
  activeIndex: number = 0
  editableIndex: number = 0 // индекс вкладки, которую можно мутировать (и будем публиковать)
  editMode: boolean = false
  editableFields: (TableField[])[] = null // объект полей, которые можно менять (передавать в v-model)

  get activeFields() { return this.fields[this.activeIndex] }
  get activeIsEditable() { return this.activeIndex === this.editableIndex }
  get activeEditableFields() {
    // return this.activeIsEditable ? this.textsForPublish : this.activeFields
    return this.editableFields && this.editableFields[this.activeIndex]
  }
  get initialFieldsPublished(): TextForPublish[] {
    // @ts-ignore
    return this.fields[this.editableIndex]
  }
  get editableFieldsPublished(): TextForPublish[] { // мутируемые поля, которые будут передаваться для публикации
    // @ts-ignore
    return this.editableFields[this.editableIndex]
  }

  mounted() {
    this.editableFields = [...this.fields.map(arr => arr.map(obj => ({...obj})))]
    this.setTextsForPublish([...this.editableFieldsPublished.map(obj => ({...obj}))])
    this.setTextsForEdit([...this.editableFieldsPublished.map(obj => ({...obj}))])
  }

  setActiveIndex(index) {
    this.activeIndex = index
  }
  turnOnEditMode() {
    this.editMode = true
    this.$emit('editModeIsOn')
  }
  turnOffEditMode() {
    this.editMode = false
    this.$emit('editModeIsOff')
  }
  confirmEdit() {
    this.turnOffEditMode()
    this.setTextsForPublish([...this.textsForEdit.map(obj => ({...obj}))])
  }
  resetForPublish() {
    this.editableFields = [...this.fields.map(arr => arr.map(obj => ({...obj})))]
    this.setTextsForPublish([...this.initialFieldsPublished.map(obj => ({...obj}))])
  }
  resetForEdit() {
    this.editableFields = [...this.fields.map(arr => arr.map(obj => ({...obj})))]
    this.resetTextsForEdit()
  }
  onResetClick() {
    this.resetForEdit()
  }
  async onCloseClick() {
    this.resetForEdit()
    await this.$nextTick()
    this.turnOffEditMode()
  }
  onInputChange(value, field: TextForPublish['field']) {
    const activeEditableFields = this.editableFields[this.activeIndex]
    const activeField = activeEditableFields.find(f => f.field === field)
    activeField.value = value
    this.updateTextForEdit({field, value})
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.block-texts

  &__tabs
    z-index 5
    position relative
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
    &.is-disabled
      pointer-events none
      opacity .75

  &__fields
    position relative
    padding 30px 10px 10px
    border 1px solid $cLightBorder
    border-radius 0 4px 4px 4px
    transition(opacity)
    &.v-enter
    &.v-leave-to
      opacity 0

  &__field
    &:not(:last-child)
      margin-bottom 25px

  &__edit-icons
    display flex
    transition(background-color\, opacity)
    &.v-enter
    &.v-leave-to
      opacity 0

  &__edit-icon-wrapper
    position relative
    padding 5px
    border 1px solid $cBrand
    border-radius 50%
    background-color white
    transition(background-color\, opacity)
    &:not(:last-child)
      margin-right 10px
    &:hover
      background-color $cBrand
    &_reset
      border-color $cWarning
      &:hover
        background-color $cWarning
    &_close
      border-color $cDanger
      &:hover
        background-color $cDanger
    &.v-enter
    &.v-leave-to
      opacity 0

  &__edit-icon
    color $cBrand
    &.el-icon-close
      color $cDanger
    &.el-icon-refresh
      color $cWarning
    transition(background-color)
    .block-texts__edit-icon-wrapper:hover &
      color white

  &__icon-tooltip
    position absolute
    top -75%
    left 50%
    transform translate3d(-50%,0,0)
    padding 2px 3px
    background-color $cLighterBorder
    white-space nowrap
    font-size 11px
    fontLight()
    transition(opacity)
    transition-duration $tFast
    opacity 0
    user-select none
    .block-texts__edit-icon-wrapper:hover &
      opacity 1

  &__btns
    margin-top 30px
    margin-left 0
</style>
