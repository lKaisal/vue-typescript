<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-sections
    +e.info
      +e.cell.table-cell(v-for="(item, index) in cells" v-html="item" :class="index > 0 ? 'col-2' : 'col-1'")
      +e.cell._button.table-cell.col-2
        ButtonApp(:btnType="btnType" :text="btnText" :isPlain="true" :width="150" class="item-sections__btn")
    +e.descr-wrapper(v-if="section.description" @click="descrIsShown = !descrIsShown" :class="{ 'is-active': descrIsShown }")
      +e.descr-row
        +e.descr-title Описание
        //- +e.I.descr-icon.el-icon-arrow-down
      +e.descr-content(v-html="section.description")
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { sectionsMapper } from '../module/store'
import { Section } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'

// const Mappers = Vue.extend({
//   // computed: {
//   //   ...sectionsMapper.mapState(['list'])
//   // }
// })

@Component({
  components: {
    ButtonApp
  }
})

export default class ItemSections extends Vue {
  @Prop() section: Section

  descrIsShown: boolean = false
  get cells() { return this.section && [ this.section.id, this.section.name, this.section.title ] }
  get isActive() { return this.section && this.section.isActive }
  get btnType() { return this.isActive ? 'warning' : 'primary' }
  get btnText() { return this.isActive ? 'Отключить' : 'Активировать' }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../common'

.item-sections

  &__info
    display flex
    // justify-content space-between
    margin-bottom 25px

  &__id
    // width 50px
    border 1px solid $cBaseBorder

  &__name
  &__title
  &__status
    // grid-size(2, 2, 2, 2, 4)
    border 1px solid $cBaseBorder

  &__btn
    width 200px

  &__descr-wrapper
    padding 10px
    // border 1px solid $cBaseBorder
    max-width 1000px

  &__descr-row
    display flex
    padding 5px
    margin -5px
    cursor pointer
    transition(opacity)
    &:hover
      opacity .75

  &__descr-icon
    transition(transform)
    .is-active &
      transform rotateZ(180deg)

  &__descr-title
    margin-right 10px
    font-size 15px
    // fontMedium()
    // color $cPText

  &__descr-content
    margin-top 15px
    // opacity 0
    // height 0
    color $cPText
    font-size 14px
    line-height 1.25
    // pointer-events none
    // transition(height\, opacity)
    // transition-timing-function ease-in-out
    // transition-duration $tMedium
    // .is-active &
    //   opacity 1
    //   height 50px
    //   pointer-events auto
</style>