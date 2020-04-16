<template lang="pug">
  include ../../../../tools/bemto.pug

  +b.filter-app
    +e.container
      ItemFilter(v-for="(item, index) in filterItems" :key="index" :item="item" class="filter-app__item")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { FilterItem } from '../../models'
import ButtonApp from '@/components/ButtonApp.vue'
import ItemFilter from './ItemFilter.vue'
import { suppliersMapper } from '../../module/store'

const SuppliersMappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapGetters(['uniqueFields'])
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
  get contractTypes() { return this.uniqueFields('contractType') }
  get confirmedFields() { return this.uniqueFields('confirmed') }
  get phoneAuthIds() { return this.uniqueFields('userId') }
  get filterItems(): FilterItem[] { return [
    { 'field': 'contractType', 'title': 'Тип договора', valuesTotal: this.contractTypes, valuesSelected: [] },
    { 'field': 'confirmed', 'title': 'Номер подтвержден', valuesTotal: this.confirmedFields, valuesSelected: [] },
    { 'field': 'userId', 'title': 'UserId', valuesTotal: this.phoneAuthIds, valuesSelected: [] }
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

  &__container
    display flex
    flex-wrap wrap

  &__item
    margin-right 35px
</style>