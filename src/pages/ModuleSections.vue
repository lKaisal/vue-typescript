<template lang="pug">
  include ../tools/bemto.pug

  +b.module-sections.page
    +e.H1.title.page-title Sections Module
    ListSections(class="module-sections__list")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { sectionsMapper } from '@/modules/sections/module/store'
import ListSections from '@/modules/sections/components/ListSections.vue'

const Mappers = Vue.extend({
  // computed: {
  //   ...sectionsMapper.mapState([]),
  // },
  // methods: {
  //   ...sectionsMapper.mapMutations([]),
  // }
})

@Component({
  components: {
    ListSections,
  }
})

export default class ModuleSections extends Mixins(Mappers) {
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.module-sections

  &__list
    grid-size(4, 4, 6, 8, 10)
    margin 0 auto
</style>
