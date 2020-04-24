<template lang="pug">
  include ../../../tools/bemto.pug

  +b.fields-texts
    +e.container
      +e.titles
        +e.field-title.card-field-title(v-for="(field, index) in fields" v-html="field.title" @click="setActiveIndex(index)"
          :class="{ 'is-active': activeIndex === index }")
      //- transition(mode="out-in")
      +e.content(:key="activeIndex" :class="{ 'is-large': isLargeField }")
        +e.field-content.card-field-content
          +e.field-content-inner(v-html="fields[activeIndex].value")
        //- +e.icon-wrapper._edit
          +e.I.icon._edit.el-icon-edit
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import { News, TableField } from '../models'

@Component({
})

export default class FieldsTexts extends Vue {
  @Prop() fields: TableField[]
  @Prop() isLargeField: boolean

  activeIndex: number = 0

  setActiveIndex(index) {
    this.activeIndex = index
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.fields-texts

  &__titles
    z-index 5
    display flex
    transform translateY(1px)

  &__field-title
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
      // opacity .75
      color $cBrandMedium
    &:not(:last-child)
      border-right none
      // &:before
      //   content ''
      //   position absolute
      //   top 0
      //   right 0
      //   bottom 0
      //   background-color white
      //   width 1px
      //   height 100%
      // // margin-right 10px
    &.is-active
      color $cBrand !important
      border-color $cLightBorder $cLightBorder white $cLightBorder
      box-shadow 0px -4px 12px -2px rgba(0,0,0,0.1)
      background-color white
      // background-color $cBrand
      // color white

  &__content
    display flex
    padding 15px
    border 1px solid $cLightBorder
    border-radius 0 4px 4px 4px
    font-size 14px
    &.is-large
      padding-top 20px
      line-height 1.3

  &__field-content-inner
    >>> p
      line-height 1.5 !important
      fontReg()
    >>> span
      line-height 1.5 !important
      font inherit !important

  &__icon-wrapper
    width 100%
    height 100%
    display flex
    justify-content center
    align-items center
    background-color $cBrand
    border 1px solid $cBrand
    border-left none
    color white
    cursor pointer
    transition(color\, background-color\, border-color)
    &:hover
      color $cBrand
      background-color white
    &_edit
      position relative
      width 38px
      height auto
      display flex
      justify-content center
      align-items center
</style>
