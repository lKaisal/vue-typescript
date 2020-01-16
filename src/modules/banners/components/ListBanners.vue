<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-banners
    +e.container
      +e.item(v-for="item in 8")
      //- ItemBanner(class="")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
  }
})

export default class ListBanners extends Vue {
}
</script>

<style lang="stylus" scoped>
@import '~@/styles/tools'

.list-banners

  &__container
    display flex
    justify-content space-between
    flex-wrap wrap

  &__item
    grid-size(4, 4, 3, 2, 3)
    height 100px
    debug()
    margin-bottom 25px
</style>
