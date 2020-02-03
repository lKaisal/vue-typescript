<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-banners
    +e.container(v-if="list && list.length")
      +e.EL-MENU.sort(:default-active="activeIndex" mode="horizontal" @select="handleSelect")
        +e.EL-MENU-ITEM.sort-item(v-for="(item, index) in sortItems" :key="index" :index="(index + 1).toString()" v-html="item")
      transition(mode="out-in")
        +e.items(:key="activeIndex")
          ItemBanner(v-for="item in activeList" :key="item.id" :banner="item" @delete="onDeleteItem" class="list-banners__item")
          +e.item._fake(v-for="n in 3")
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Banner } from '../models'
import ItemBanner from './ItemBanner.vue'
import { bannersMapper } from '../module/store'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapGetters(['listSorted', 'listActive', 'listInactive'])
  },
})

@Component({
  components: {
    ItemBanner
  }
})

export default class ListBanners extends Mappers {
  sortItems: String[] = [ 'Все баннеры', 'Активные (показаны в приложении)', 'Неактивные (не показаны в приложении)' ]
  activeIndex: string = '1'

  get list() { return this.listSorted }
  get listActive() { return this.listActive }
  get listInactive() { return this.listInactive }
  // get list() { return this.state.list }
  get activeList() {
    if (this.activeIndex === '2') return this.listActive
    else if (this.activeIndex === '3') return this.listInactive
    else return this.list
  }

  handleSelect(index) {
    this.activeIndex = index
  }
  onDeleteItem(id) {
    this.$emit('deleteItem', id)
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
    transition()
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
