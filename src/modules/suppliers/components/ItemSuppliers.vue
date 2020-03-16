<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-suppliers
    +e.info
      +e.cell.table-cell(v-for="(field, index) in fields"
        :class="{ 'col-075': field.isSmall, 'col-1': field.isMedium, 'col-11': field.isXMedium, 'col-2': !field.isSmall && !field.isMedium && !field.isXMedium }")
        +e.cell-title(v-if="titleIsShown && field.title" v-html="`${field.title}:&ensp;`")
        +e.cell-text(v-if="index < fields.length - 1" v-html="getFieldContent(field)")
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
    return field.field === 'phone' ? `+${this.supplier[field.field]}` : this.supplier[field.field]
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
        flex-grow 1
        fontMedium()
    +lt-md()
      display flex
      align-items flex-start
      flex-wrap wrap

  &__cell-title
    white-space nowrap
    fontMedium()
    margin-bottom 5px
</style>