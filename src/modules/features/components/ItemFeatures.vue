<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-features
    +e.info
      +e.cell.table-cell.col-05
        +e.checkbox.checkbox-features(@click="onCheckboxClick" :class="{ 'is-active': isActive }")
          +e.I.checkbox-icon.el-icon-check
      +e.cell.table-cell.col-2(v-for="(item, index) in cells" v-html="item")
    +e.descr-wrapper(v-if="section.description" @click="descrIsShown = !descrIsShown" :class="{ 'is-active': descrIsShown }")
      +e.descr-content(v-html="section.description + ' ' + section.description + ' ' + section.description")
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { featuresMapper } from '../module/store'
import { Section } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'

@Component({
  components: {
    ButtonApp
  }
})

export default class ItemFeatures extends Vue {
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

.item-features

  &__info
    display flex

  &__cell
    color $cPText
    &:nth-of-type(2)
      flex-grow 1
      fontMedium()

  &__btn
    width 200px

  &__descr-wrapper
    padding 10px 15px
    margin-top 10px
    +xl()
      margin-left grid-column(10, $gutterXl, .5)
    +lg()
      margin-left grid-column(8, $gutterLg, .5)
    +md()
      margin-left grid-column(6, $gutterMd, .5)

  &__descr-content
    // margin-top 15px
    color $cPText
    font-size 14px
    line-height 1.25
</style>