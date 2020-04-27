<template lang="pug">
  include ../../../tools/bemto.pug

  +b.fields-texts
    +e.container
      +e.tabs
        +e.tab.card-field-title(v-for="(tab, index) in tabs" :key="index" v-html="tab" @click="setActiveIndex(index)"
          :class="{ 'is-active': activeIndex === index }")
      +e.fields
        +e.field(v-for="(field, index) in fields" :key="index")
          +e.title.card-field-title(v-html="field[activeIndex].title")
          +e.field-content.card-field-content
            +e.field-content-inner(v-html="field[activeIndex].value")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import { News, TableField } from '../models'

@Component({
})

export default class FieldsTexts extends Vue {
  @Prop() fields: TableField[]

  activeIndex: number = 0
  tabs = ['Мобильное приложение', 'Веб-версия']

  setActiveIndex(index) {
    this.activeIndex = index
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.fields-texts

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

  &__fields
    padding 25px 10px
    border 1px solid $cLightBorder
    border-radius 0 4px 4px 4px

  &__field
    &:not(:last-child)
      margin-bottom 25px

  &__field-content
    font-size 14px

  &__field-content-inner
    >>> p
      line-height 1.5 !important
      fontReg()
    >>> span
      line-height 1.5 !important
      font inherit !important
</style>
