<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-banners
    +e.container
      +e.EL-MENU.sort(:default-active="(activeHashIndex + 1).toString()" mode="horizontal" @select="handleSelect")
        +e.EL-MENU-ITEM.sort-item(v-for="(item, index) in sortItems" :key="index" :index="(index + 1).toString()" v-html="item" :class="{ 'is-disabled': !tabs[index].list.length }")
      transition(mode="out-in" @enter="animateOneMoreTime")
        +e.items(:key="activeHashIndex")
          ItemBanner(v-for="(item, index) in activeList" :key="index" :banner="item"
            @editClicked="goToPageEdit(item.id)" @deleteClicked="onDeleteClick(item.id)" @createClicked="onCreateClick(index + 1)" @dblclick.prevent.native="onDblClick(item, index + 1)"
            :class="[{ 'list-banners__item_free': !item }, 'list-banners__item js-voa js-voa-start' ]")
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
    ...bannersMapper.mapState(['activeAmount', 'hashes']),
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
  observer = null

  get tabs() {
    return [
      { hash: this.hashes[0], list: this.listActiveComposed, sort: `Активные (${this.listActive.length})` },
      { hash: this.hashes[1], list: this.listDelayed, sort: `С отложенным стартом (${this.listDelayed.length})` },
      { hash: this.hashes[2], list: this.listInactive, sort: `Архивные (${this.listInactive.length})` },
    ]
  }
  get activeHash() { return this.$route.hash }
  // @ts-ignore
  get activeHashIndex() { return this.activeHash && this.hashes.indexOf(this.activeHash.slice(1)) || 0 }
  get activeList() { return this.tabs[this.activeHashIndex].list}
  get sortItems() { return this.tabs.map(item => item.sort) }
  get listActiveComposed() {
    const count = this.activeAmount.value
    const composed: Banner[] = []

    for (let i = 1; i <= count; i++) {
      const data = this.listActive.find(b => b.position === i)
      if (data) composed.push(data)
      else composed.push(null)
    }

    return composed
  }

  async mounted() {
    await this.$nextTick()
    this.animateOneMoreTime()
  }

  handleSelect(index) {
    this.$router.push({path: this.$route.path, hash: `#${this.hashes[index - 1]}` }).catch(err => {})
  }
  onCreateClick(index: Number) {
    this.setBannerCurrentSuccess(Object.assign({}, { 'position': index }, null))
    this.goToPageCreate()
  }
  onDeleteClick(id) {
    this.$emit('deleteItem', id)
  }
  onDblClick(banner, index) {
    if (banner) this.goToPageEdit(banner.id)
    else {
      this.updateField({name: 'sort', value: index })
      this.goToPageCreate()
    }
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

  &__sort-item
    &.is-disabled
      pointer-events none
      opacity 1

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
    display flex
    flex-direction column
    align-items center
    max-width 650px
    +xl()
      margin-bottom 75px
    +lt-xl()
      margin-bottom 50px
    +lt-md()
      margin-right auto
      margin-left auto
    &_fake
      height 0
      visibility hidden
      opacity 0
      font-size 0
      pointer-events none
</style>
