<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-suppliers
    +e.info
      +e.cell.table-cell(v-for="(item, index) in cells" v-html="item" :class="{ 'col-05': index === 0, 'col-2': index > 0 }")
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { phonesMapper } from '../module/store'
import { Supplier } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'

@Component({
  components: {
    ButtonApp
  }
})

export default class ItemSuppliers extends Vue {
  @Prop() supplier: Supplier

  descrIsShown: boolean = false
  get cells() { return this.supplier && [ this.supplier.id, this.supplier.name, this.supplier.inn, this.supplier.phone, this.supplier.email ] }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../common'

.item-suppliers

  &__info
    display flex
    +xs()
      flex-wrap wrap

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
      padding 10px 0
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