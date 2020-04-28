<template lang="pug">
  include ../../../tools/bemto.pug

  +b.block-texts
    +e.container
      +e.tabs
        +e.tab.card-field-title(v-for="(tab, index) in tabs" :key="index" v-html="tab" @click="setActiveIndex(index)"
          :class="{ 'is-active': activeIndex === index, 'is-disabled': editMode && activeIndex !== index }")
      +e.fields
        transition
          +e.edit-icons.card-btn-close(v-if="!editMode && activeIndex === 0")
            +e.edit-icon-wrapper(@click="turnOnEditMode")
              +e.edit-icon.el-icon-edit
          +e.edit-icons.card-btn-close(v-else-if="editMode")
            +e.edit-icon-wrapper(@click="resetChanges")
              +e.edit-icon.el-icon-refresh
            +e.edit-icon-wrapper._close(@click="turnOffEditMode")
              +e.edit-icon.el-icon-close
        FieldText(v-for="(field, index) in activeFields" :key="index" :editMode="editMode" :isEditorField="index === 2" :field="field"
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

  get activeFields() {
    return this.fields[this.activeIndex]
  }

  setActiveIndex(index) {
    this.activeIndex = index
  }

  turnOnEditMode() {
    this.editMode = true
  }
  resetChanges() {

  }
  turnOffEditMode() {
    this.editMode = false
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

</style>

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
    transition(background-color)
    .block-texts__edit-icon-wrapper:hover &
      color white
</style>
