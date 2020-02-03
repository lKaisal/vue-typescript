<template lang="pug">
  include ../../../tools/bemto.pug

  +b.module-banners
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'



@Component({
  components: {
  }
})

export default class ModuleBanners extends Vue {
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.module-banners

  &__page
    //
</style>
