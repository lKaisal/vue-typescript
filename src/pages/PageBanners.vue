<template lang="pug">
  include ../tools/bemto.pug

  +b.page-banners
    ModuleBanners
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ModuleBanners from '@/modules/banners-es/module-banners.esm'
// const ModuleBanners = require ('@/modules/banners-es/module-banners.esm')

@Component({
  components: {
    ModuleBanners,
  }
})

export default class PageBanners extends Vue {
}
</script>

<style lang="stylus" scoped>
@import '~@/styles/tools'

.page-banners
  // 
</style>
