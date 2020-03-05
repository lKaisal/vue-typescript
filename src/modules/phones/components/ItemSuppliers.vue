<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-suppliers
    +e.info
      +e.cell.table-cell(v-for="(field, index) in fields" :class="{ 'col-075': field.isSmall, 'col-2': !field.isSmall }")
        +e.cell-text(v-if="index < fields.length - 1" v-html="supplier[field.field]")
        ButtonApp(v-else :isLow="true" :isPlain="true" text="Открыть" @clicked="onBtnClick" class="item-suppliers__btn")
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { phonesMapper } from '../module/store'
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

  descrIsShown: boolean = false

  onBtnClick() {
    this.$emit('clicked')
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
    &:nth-of-type(2)
      flex-grow 1
      fontMedium()
</style>