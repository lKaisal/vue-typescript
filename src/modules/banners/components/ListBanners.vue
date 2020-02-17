<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-banners
    +e.container
      +e.EL-MENU.sort(:default-active="activeIndex" mode="horizontal" @select="handleSelect")
        +e.EL-MENU-ITEM.sort-item(v-for="(item, index) in sortItems" :key="index" :index="(index + 1).toString()" v-html="item")
      transition(mode="out-in" @enter="animateOneMoreTime")
        +e.items(:key="activeIndex")
          ItemBanner(v-for="(item, index) in activeList" :key="index" :banner="item.data"
            @editClicked="goToPageEdit(item.data.id)" @deleteClicked="onDeleteItem(item.data.id)" @createClicked="createClicked(index + 1)" @dblclick.prevent.native="onDblClick(item.data, index + 1)"
            :class="[{ 'list-banners__item_free': !item.data }, 'list-banners__item js-voa js-voa-start' ]")
          +e.item._fake(v-for="n in 3")
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from 'vue-property-decorator'
import { Banner } from '../models'
import ItemBanner from './ItemBanner.vue'
import { bannersMapper } from '../module/store'
import sleep from '@/mixins/sleep'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['activeAmount']),
    ...bannersMapper.mapGetters(['listActive', 'listInactive', 'listDelayed'])
  },
  methods: {
    ...bannersMapper.mapMutations(['setBannerCurrentSuccess']),
    ...bannersMapper.mapActions(['updateField'])
  }
})

@Component({
  components: {
    ItemBanner
  }
})

export default class ListBanners extends Mappers {
  activeIndex: string = '1'
  observer = null

  get activeList() {
    if (this.activeIndex === '1') return this.listActiveComposed
    else if (this.activeIndex === '2') return this.listDelayedComposed
    else if (this.activeIndex === '3') return this.listInactiveComposed
  }
  get sortItems() { return [ `Активные (${this.listActive.length})`, `С отложенным стартом (${this.listDelayed.length})`, `Архивные (${this.listInactive.length})` ] }
  get listActiveComposed() {
    const count = this.activeAmount.value
    const composed: { data: Banner }[] = []

    for (let i = 1; i <= count; i++) {
      const data = this.listActive.find(b => b.position === i)
      if (data) composed.push({ data })
      else composed.push({ data: null })
    }

    return composed
  }
  get listDelayedComposed() {
    const composed: { data: Banner }[] = []
    for (const item of this.listDelayed) composed.push({data: item})

    return composed
  }
  get listInactiveComposed() {
    const composed: { data: Banner }[] = []
    for (const item of this.listInactive) composed.push({data: item})

    return composed
  }

  async mounted() {
    await this.$nextTick()
    this.animateOneMoreTime()
  }

  handleSelect(index) {
    this.activeIndex = index
  }
  onDeleteItem(id) {
    this.$emit('deleteItem', id)
  }
  onDblClick(banner, index) {
    if (banner) this.goToPageEdit(banner.id)
    else {
      this.updateField({name: 'sort', value: index })
      this.goToPageCreate()
    }
  }
  createClicked(index: Number) {
    this.setBannerCurrentSuccess(Object.assign({}, { 'position': index }, null))
    this.goToPageCreate()
  }
  goToPageCreate() { this.$router.push({ path: '/banners/create' }) }
  goToPageEdit(id: Banner['id']) { this.$router.push({ path: `/banners/edit/${id}` }).catch(err => {}) }
  animateOneMoreTime() {
    this.$emit('animateOneMore')
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.list-banners

  &__sort
    margin-bottom 50px

  &__items
    display flex
    justify-content space-between
    flex-wrap wrap
    transition(opacity)
    &.v-enter
    &.v-leave-to
      opacity 0

  &__item
    grid-size(4, 4, 3, 2.6, 3)
    position relative
    // height 500px
    // max-height 100vh
    display flex
    flex-direction column
    align-items center
    // padding 75px 50px 50px
    // border 1px solid rgba(0,0,0,.125)
    // border-radius .25rem
    // background-color white
    // transition(border-color)
    // &:hover
    //   border-color $cBrand
    +xl()
      margin-bottom 75px
    +lt-xl()
      margin-bottom 50px
    &_fake
      height 0
      visibility hidden
      opacity 0
      font-size 0
      pointer-events none
</style>
