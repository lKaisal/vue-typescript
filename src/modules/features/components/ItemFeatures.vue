<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-features
    +e.info
      +e.cell.table-cell(v-for="(field, index) in fields"
        :class="{ 'col-05': field.isSmall, 'col-1': field.isMedium, 'col-2': !field.isSmall && !field.isMedium }")
        +e.checkbox.checkbox-features(v-if="index === 0" @click="onCheckboxClick" :class="{ 'is-active': isActive }")
          +e.I.checkbox-icon.el-icon-check
          +e.checkbox-text(v-if="isXs" v-html="btnText")
        +e.cell-content(v-else v-html="getFieldContent(field)")
    +e.descr-wrapper(v-if="section.description" @click="descrIsShown = !descrIsShown" :class="{ 'is-active': descrIsShown }")
      +e.descr-content(v-html="section.description")
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { featuresMapper } from '../module/store'
import { Section, TableField } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'
import { mapState } from 'vuex'

@Component({
  components: {
    ButtonApp
  },
  computed: {
    ...mapState('system', [
      'breakpoint'
    ])
  }
})

export default class ItemFeatures extends Vue {
  @Prop() section: Section
  @Prop() isActive: boolean
  @Prop() fields: TableField[]

  breakpoint!: string
  descrIsShown: boolean = false

  get isXs() { return this.breakpoint === 'xs' }
  get status() { return this.section.active ? 'Активирован' : 'Не активирован' }
  get btnType() { return this.section.active ? 'warning' : 'primary' }
  get btnText() { return this.isActive ? 'Деактивировать' : 'Выбрать' }

  getFieldContent(field: TableField) {
    return field.field === 'active' ? this.status : this.section[field.field]
  }
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
    +xs()
      flex-wrap wrap

  &__cell
    color $cPText
    width-between-property 'font-size' 601 14 1000 16 true true
    &:nth-of-type(2)
      flex-grow 1
      fontMedium()

  &__checkbox
    +xs()
      justify-content flex-start

  &__checkbox-text
    margin-left 10px

  &__btn
    width 200px

  &__descr-wrapper
    padding 10px 15px
    margin-top 10px
    +xl()
      margin-left grid-column(10, $gutterXl, .5)
      padding 10px 0
    +lg()
      margin-left grid-column(8, $gutterLg, .5)
    +md()
      margin-left grid-column(6, $gutterMd, .5)
    +lt-md()
      padding 10px

  &__descr-content
    // margin-top 15px
    color $cPText
    font-size 14px
    line-height 1.25
</style>