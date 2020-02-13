<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-banners
    +e.container(v-if="list.data && list.data.length")
      +e.EL-MENU.sort(:default-active="activeIndex" mode="horizontal" @select="handleSelect")
        +e.EL-MENU-ITEM.sort-item(v-for="(item, index) in sortItems" :key="index" :index="(index + 1).toString()" v-html="item")
      transition(mode="out-in" @enter="animateOneMoreTime")
        +e.items._active(v-if="activeIndex === '1'" key="activeList")
          ItemBanner(v-for="(item, index) in activeAmount.value" :key="item.id" :banner="activeList.find(b => b.position === index + 1)"
            @delete="onDeleteItem" @dblclick.prevent.native="emptyPositions.indexOf(index + 1) >= 0 ? goToPageCreate() : goToPageEdit(item.id)"
            :class="[{ 'list-banners__item_free': emptyPositions.indexOf(index + 1) >= 0 }, 'list-banners__item js-voa js-voa-start' ]")
          //- ItemBanner(v-for="n in emptyCount" class="list-banners__item list-banners__item_free")
          +e.item._fake(v-for="n in 3")
        +e.items._inactive(v-else key="inactiveList")
          ItemBanner(v-for="(item, index) in listInactive" :key="item.id" :banner="item" @dblclick.prevent.native="goToPageEdit(item.id)" class="list-banners__item js-voa js-voa-start")
          +e.item._fake(v-for="n in 3")
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from 'vue-property-decorator'
import { Banner } from '../models'
import ItemBanner from './ItemBanner.vue'
import { bannersMapper } from '../module/store'
import animateIfVisible from '@/mixins/animateIfVisible'
import sleep from '@/mixins/sleep'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['list', 'activeAmount']),
    ...bannersMapper.mapGetters(['listActive', 'listInactive'])
  },
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
    if (this.activeIndex === '1') return this.listActive
    else if (this.activeIndex === '2') return this.listInactive
    // else return this.list
  }
  get sortItems() { return [ `Активные (${this.listActive.length})`, `Архивные (${this.listInactive.length})` ] }
  get emptyPositions() { 
    const count = this.activeAmount.value
    const positions = this.activeList.map(b => b.position)
    const empty = []
    for (let i = 0; i < count; i++) {
      if (positions.every(p => p !== i)) empty.push(i)
    }

    return empty
  }

  async mounted() {
    await this.$nextTick()
    animateIfVisible()
  }

  handleSelect(index) {
    this.activeIndex = index
  }
  onDeleteItem(id) {
    this.$emit('deleteItem', id)
  }
  animateOneMoreTime() {
    animateIfVisible()
  }
  goToPageCreate() { this.$router.push({ path: '/banners/create' }) }
  goToPageEdit(id: Banner['id']) { this.$router.push({ path: `/banners/edit/${id}` }).catch(err => {}) }
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
