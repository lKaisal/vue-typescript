<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-suppliers
    +e.info
      +e.cell.table-cell(v-for="(field, index) in fields"
        :class="{ 'is-sticky': field.isSticky, 'col-075': field.isSmall, 'col-1': field.isMedium, 'col-11': field.isXMedium, 'col-2': field.isLarge, 'col-3': field.isXLarge, 'is-centered': field.isCentered }")
        +e.cell-title(v-if="titleIsShown && field.title" v-html="`${field.title}:&ensp;`")
        +e.cell-text(v-if="field.field" v-html="getFieldContent(field)")
        ButtonApp(v-else :isLow="true" :isPlain="true" :fontSize="12" text="Открыть" @clicked="onBtnClick" class="item-suppliers__btn")
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { suppliersMapper } from '../module/store'
import { Supplier, TableField } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'

@Component({
  components: {
    ButtonApp
  }
})

export default class ItemSuppliers extends Vue {
  @Prop() supplier: Supplier
  @Prop() fields: TableField[]
  @Prop() titleIsShown: boolean

  descrIsShown: boolean = false

  onBtnClick() {
    this.$emit('clicked')
  }
  getFieldContent(field: TableField) {
    const value = this.supplier[field.field]
    const isConfirmed = field.field === 'confirmed'
    const isPhone = field.field === 'phone'
    const isCreatedAt = field.field === 'createdAt' && field.title === 'Дата регистрации'

    if (isConfirmed) return value ? 'Подтвержден' : 'Не подтвержден'
    else if (isCreatedAt) return value.toString().split(' ')[0]
    else return isPhone ? `+${value}` : value
  }
  
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../common'

.item-suppliers

  &__info
    display flex
    +lt-md()
      flex-wrap wrap

  &__cell
    color $cPText
    line-height 1.25
    +gt-md()
      &:nth-of-type(2)
        fontMedium()
    +lt-md()
      display flex
      align-items flex-start
      flex-wrap wrap
      border-bottom none
    &:first-child
    &:nth-child(2)
    &:last-child
      z-index 1
      position sticky
      background-color white
    &:first-child
      left 0
    &:nth-child(2)
      left 120px
    &:last-child
      right 0
    .list-suppliers__item:nth-of-type(2n + 1) &
      background-color $cDisabled

  &__cell-title
    white-space nowrap
    fontMedium()
    margin-bottom 5px
</style>