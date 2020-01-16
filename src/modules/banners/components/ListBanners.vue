<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-banners
    +e.container(v-if="list && list.length")
      ItemBanner(v-for="item in list" :key="item.id" :banner="item" class="list-banners__item")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Banner } from '../models'
import ItemBanner from '../components/ItemBanner.vue'

@Component({
  components: {
    ItemBanner
  }
})

export default class ListBanners extends Vue {
  // get list(): Banner[] { return this.$store.state.banners.list }
  get list() { return this.$store.getters['banners/listSortedAndCleared'] }
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
    position relative
    height 500px
    max-height 100vh
    padding 50px
    display flex
    flex-direction column
    align-items center
    border 1px solid rgba(0,0,0,.125)
    border-radius .25rem
    margin-bottom 25px
</style>
