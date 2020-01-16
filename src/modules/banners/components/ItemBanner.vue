<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-banner
    +e.container
      +e.img-wrapper
        IMG.item-banner__img(:src="banner.bannerImageUrl")
      +e.info
        +e.bannerDate(v-html="banner.bannerDate")
        +e.createdAt(v-html="banner.createdAt")
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Banner } from '../models'

@Component({
  components: {
  }
})

export default class ListBanners extends Vue {
  @Prop() banner: Banner

  get list(): Banner[] { return this.$store.state.banners.list }
}
</script>

<style lang="stylus" scoped>
@import '~@/styles/tools'

.item-banner

  &__container
    display flex
    justify-content center
    flex-wrap wrap
    width 100%
    height 100%

  &__img-wrapper
    position relative
    width 80%
    height 80%
    overflow hidden
    margin-bottom 50px

  &__img
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    max-width 100%
    max-height 100%
</style>
