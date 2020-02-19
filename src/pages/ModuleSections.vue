<template lang="pug">
  include ../tools/bemto.pug

  +b.module-sections.page
    +e.H1 Sections Module
    ListBanners
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { sectionsMapper } from '@/modules/sections/module/store'
import ListBanners from '@/modules/sections/components/ListSections.vue'

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
    ListBanners,
  }
})

export default class ModuleSections extends Mixins(Mappers) {
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.module-banners
  //
</style>
