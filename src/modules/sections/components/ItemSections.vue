<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-sections
    +e.info
      +e.cell.table-cell.col-1
        +e.checkbox.checkbox-sections(@click="onCheckboxClick" :class="{ 'is-active': isActive }")
          +e.I.checkbox-icon.el-icon-check
      +e.cell.table-cell.col-2(v-for="(item, index) in cells" v-html="item")
      //- +e.cell._button.table-cell.col-2
        ButtonApp(:btnType="btnType" :text="btnText" :isPlain="true" :width="150" class="item-sections__btn")
    +e.descr-wrapper(v-if="section.description" @click="descrIsShown = !descrIsShown" :class="{ 'is-active': descrIsShown }")
      //- +e.descr-row
        //- +e.descr-title Описание
        //- +e.I.descr-icon.el-icon-arrow-down
      +e.descr-content(v-html="section.description + ' ' + section.description + ' ' + section.description")
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
  @Prop() isActive: boolean

  descrIsShown: boolean = false
  get cells() { return this.section && [ this.section.feature || this.section.username || this.section.name, this.section.updatedAt, this.section.createdAt, this.status ] }
  get status() { return this.section.active ? 'Активирован' : 'Не активирован' }
  get btnType() { return this.section.active ? 'warning' : 'primary' }
  get btnText() { return this.section.active ? 'Отключить' : 'Активировать' }

  onCheckboxClick() {
    this.$emit('checkboxClicked')
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../common'

.item-sections

  &__info
    display flex
    margin-bottom 10px

  &__cell
    color $cPText

  &__btn
    width 200px

  &__descr-wrapper
    padding 10px
    +xl()
      margin-left grid-column(10, $gutterXl, 1)
    +lg()
      margin-left grid-column(8, $gutterLg, 1)
    +md()
      margin-left grid-column(6, $gutterMd, 1)

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
    fontMedium()

  &__descr-content
    margin-top 15px
    color $cPText
    font-size 14px
    line-height 1.25
</style>