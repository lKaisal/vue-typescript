<template lang="pug">
  include ../../../../tools/bemto.pug

  +b.filter-app
    +e.container
      ItemFilter(v-for="(item, index) in filterItems" :item="item")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { FilterItem } from '../../models'
import ButtonApp from '@/components/ButtonApp.vue'
import ItemFilter from './ItemFilter.vue'
import { suppliersMapper } from '../../module/store'

const SuppliersMappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapGetters(['contractTypes'])
  },
  methods: {
    ...suppliersMapper.mapMutations(['addFilterFields']),
  }
})

@Component({
  components: {
    ButtonApp,
    ItemFilter
  }
})

export default class FilterSuppliers extends Mixins(SuppliersMappers) {
  get filterItems(): FilterItem[] { return [
    { 'field': 'contractType', 'title': 'Тип договора', values: this.contractTypes }
  ]}

  created() {
    if (!this.filterItems || !this.filterItems.length) return

    this.addFilters()
  }

  addFilters() {
    this.addFilterFields(this.filterItems)
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../styles/tools'

.filter-app

  &__row
    display flex
    +xs()
      flex-wrap wrap

  &__title
    display flex
    align-items center
    margin-bottom 7px
    fontMedium()

</style>