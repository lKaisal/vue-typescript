<template lang="pug">
  include ../tools/bemto.pug

  +b.page-banners
    ModuleBanners
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ModuleBanners from '@/modules/banners/ModuleBanners.vue'
import moduleBanners from '@/modules/banners/module'

@Component({
  components: {
    ModuleBanners,
  }
})

export default class PageBanners extends Vue {
  get moduleLoaded() { return !!this.$store.state.banners }
}
</script>

<style lang="stylus" scoped>
@import '~@/styles/tools'

.page-banners
  // 
</style>
