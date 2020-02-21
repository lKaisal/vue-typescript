<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-sections
    +e.container(v-if="list && list.length")
      +e.row.table-row
        +e.title.table-cell(v-for="(title, index) in titles" v-html="title" :class="index > 0 ? 'col-2' : 'col-1'")
      ItemSections(v-for="(item, index) in list" :key="index" :section="item" class="list-sections__item table-row")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { sectionsMapper } from '../module/store'
import ItemSections from '../components/ItemSections.vue'

const Mappers = Vue.extend({
  computed: {
    ...sectionsMapper.mapState(['list'])
  }
})

@Component({
  components: {
    ItemSections
  }
})

export default class ListSections extends Mappers {
  titles: string[] = [ 'id', 'name', 'title', 'Управление' ]
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../common'

.list-sections

  &__container
    width 100%

  &__row
    display flex

  &__title
    text-transform capitalize
    color $cSecondaryText
    fontMedium()
</style>