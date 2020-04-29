<template lang="pug">
  include ../../../tools/bemto.pug

  +b.block-texts
    +e.container
      +e.tabs
        +e.tab.card-field-title(v-for="(tab, index) in tabs" :key="index" v-html="tab" @click="setActiveIndex(index)"
          :class="{ 'is-active': activeIndex === index, 'is-disabled': editMode && activeIndex !== index }")
      +e.fields
        //- +e.edit-icons.card-btn-close(v-if="!editMode && activeIndex === 0")
        //-   +e.edit-icon-wrapper(@click="turnOnEditMode")
        //-     +e.edit-icon.el-icon-edit
        +e.edit-icons.card-btn-close(v-if="activeIndex === 0")
          +e.edit-icon-wrapper(v-if="!editMode" @click="turnOnEditMode")
            +e.edit-icon.el-icon-edit
            +e.icon-tooltip Редактировать новость
          +e.edit-icon-wrapper(v-if="editMode" @click="confirmEdit")
            +e.edit-icon.el-icon-check
            +e.icon-tooltip Сохранить новость
          +e.edit-icon-wrapper._reset(v-if="editMode" @click="resetChanges")
            +e.edit-icon.el-icon-refresh
            +e.icon-tooltip Отменить изменения
          +e.edit-icon-wrapper._close(v-if="editMode" @click="onTurnOffClick")
            +e.edit-icon.el-icon-close
            +e.icon-tooltip Закрыть
        FieldText(v-for="(field, index) in activeEditableFields" :key="field.value" :editMode="editMode" :isEditorField="index === 2" :field="field"
          @inputChange="onInputChange" class="block-texts__field")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import { News, TableField } from '../models'
import FieldText from '../components/FieldText.vue'

@Component({
  components: {
    FieldText
  }
})

export default class BlockTexts extends Vue {
  @Prop() fields: (TableField[])[]

  activeIndex: number = 0
  tabs = ['Мобильное приложение', 'Веб-версия']
  editMode: boolean = false
  editableFields: (TableField[])[] = null

  get activeFields() {
    return this.fields[this.activeIndex]
  }
  get activeEditableFields() {
    return this.editableFields && this.editableFields[this.activeIndex]
  }

  mounted() {
    this.editableFields = this.fields.map(arr => arr.map(obj => ({...obj})))
  }

  setActiveIndex(index) {
    this.activeIndex = index
  }
  turnOnEditMode() {
    this.editMode = true
  }
  confirmEdit() {
    this.editMode = false
  }
  resetChanges() {
    this.editableFields = this.fields.map(arr => arr.map(obj => ({...obj})))
  }
  turnOffEditMode() {
    this.editMode = false
  }
  onTurnOffClick() {
    this.resetChanges()
    this.turnOffEditMode()
  }
  onInputChange(value, field: keyof News) {
    const activeEditableFields = this.editableFields[this.activeIndex]
    const activeField = activeEditableFields.find(f => f.field === field)
    activeField.value = value
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
</style>
