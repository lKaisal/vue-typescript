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
          +e.edit-icon-wrapper(v-if="editMode" @click="confirmEdit")
            +e.edit-icon.el-icon-check
          +e.edit-icon-wrapper._reset(v-if="editMode" @click="resetChanges")
            +e.edit-icon.el-icon-refresh
          +e.edit-icon-wrapper._close(v-if="editMode" @click="turnOffEditMode")
            +e.edit-icon.el-icon-close
        FieldText(v-for="(field, index) in activeEditableFields" :key="index" :editMode="editMode" :isEditorField="index === 2" :field="field"
          class="block-texts__field")
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
    this.editableFields = [...this.fields]
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
  async resetChanges() {
    this.turnOffEditMode()
    await this.$nextTick()
    const activeEditableFields = this.editableFields[this.activeIndex]
    activeEditableFields.forEach((editableField, index) => {
      editableField.value = this.activeFields[index].value
    })
    this.turnOnEditMode()
  }
  turnOffEditMode() {
    this.editMode = false
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
</style>
