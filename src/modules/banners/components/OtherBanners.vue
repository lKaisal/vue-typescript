<template lang="pug">
  include ../../../tools/bemto.pug

  +b.other-banners
    +e.H2.title Другие баннеры
    +e.row(v-if="list && list.length")
      +e.item(v-for="(item, index) in list" :key="item.id")
        +e.img-wrapper
          IMG(:src="item.bannerImageUrl")
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Banner } from '../models'
import { bannersMapper } from '../module/store'
import sleep from '@/mixins/sleep'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapGetters(['listSorted', 'listActive', 'listInactive'])
  },
})

@Component({
})

export default class ListBanners extends Mappers {
  @Prop() list: Banner[]
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.other-banners

  &__title
    margin-bottom 25px
    text-align center

  &__row
    display flex
    justify-content space-between

  &__item
    position relative
    width 25%
    overflow hidden
    &:not(:last-child)
      margin-right 50px

  &__img-wrapper
    position relative
    width 100%
    padding-bottom 59%
    >>> img
      position absolute
      left 50%
      // top 50%
      transform translateX(-50%)
      height 100%
      max-height none
      max-width none
</style>
