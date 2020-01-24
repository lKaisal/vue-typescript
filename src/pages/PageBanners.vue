<template lang="pug">
  include ../tools/bemto.pug

  +b.page-banners
    //- ModuleBanners
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
// import ModuleBanners from '@/modules/banners-es/banners-module.esm'
// import css from '@/modules/banners-es/banners-module.esm'
const ModuleBanners = require ('@/modules/banners-es/banners-module.ssr') // -- returns an error:  Failed to mount component: template or render function not defined.

@Component({
  components: {
    // ModuleBanners,
  }
})

export default class PageBanners extends Vue {
}
</script>

<style lang="stylus">
@import '~@/styles/tools'
// @import '~@/modules/banners-es/banners-module.esm.css'
// @import '~@/modules/banners-es/module-banners.css'

.page-banners
  // 
</style>
