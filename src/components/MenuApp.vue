<template lang="pug">
  include ../tools/bemto.pug

  +b.menu-app
    +e.container(:class="{ 'is-open': menuIsOpen }")
      +e.toggle(key="icon-toggle")
        +e.I.toggle-icon(:key="menuIsOpen" @click="onToggleClick" :class="{ 'el-icon-s-fold': menuIsOpen, 'el-icon-s-unfold': !menuIsOpen }")
      transition(mode="out-in")
        +e.links-wrapper(v-if="menuIsOpen" v-click-outside="onClickOutside")
          //- +e.H1.title.page-title Список разделов
          +e.links
            +e.link-wrapper(v-for="(route, index) in routes")
              +e.ROUTER-LINK.link(tag="div" :to="route.path")
                +e.link-text(v-html="route.meta && route.meta.title")
                +e.I.link-icon.el-icon-arrow-right
            +e.link-wrapper
              LogOut(:isInMenu="true")
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator'
import Router from '@/services/router'
import LogOut from '@/components/LogOut.vue'
import vClickOutside from 'v-click-outside'
import { mapState, mapMutations } from 'vuex'

@Component({
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    LogOut
  },
  computed: {
    ...mapState('system', [
      'menuIsOpen'
    ])
  },
  methods: {
    ...mapMutations('system', [
      'toggleMenu', 'openMenu', 'closeMenu'
    ])
  }
})

export default class MenuApp extends Vue {
  public menuIsOpen!: boolean
  public toggleMenu!: () => void
  public openMenu!: () => void
  public closeMenu!: () => void
  get routes() { return this.$store.getters['system/modules'] }
  get isRootPage() { return this.$route && this.$route.fullPath === '/' }

  created() {
    document.addEventListener('keydown', this.keyDownHandler)
  }
  beforeDestroy() {
    document.addEventListener('keydown', this.keyDownHandler)
  }

  onToggleClick() {
    if (!this.isRootPage) this.toggleMenu()
  }
  onClickOutside() {
    if (this.isRootPage) return

    if (this.menuIsOpen) this.closeMenu()
  }
  keyDownHandler(evt: KeyboardEvent) {
    if (evt.key === 'Escape') this.onClickOutside()
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.menu-app

  &__container
    width 100%
    height 100%
    +gt-sm()
      &:before
        z-index -1
        content ''
        position absolute
        top 0
        left auto
        bottom 0
        width 100vw
        background-color rgba(0,0,0,.5)
        opacity 0
        pointer-events none
        transition(opacity)
      &.is-open
        &:before
          opacity 1

  &__toggle
    z-index 5
    position fixed
    top 20px
    left 20px

  &__toggle-icon
    font-size 36px
    color $cBrand
    cursor pointer

  &__links-wrapper
    height 100%
    padding-top 75px
    background-color white
    box-shadow 0 1rem 3rem rgba(0,0,0,.175)
    transition(opacity\, transform)
    transition-duration $tMedium
    +xs()
      width 100vw
    +sm()
      width 40vw
    +gt-md()
      width 25vw
    +gt-lg()
      width 20vw
    &.v-enter
    &.v-leave-to
      transform translateX(-110%)

  &__links
    position relative

  &__link-wrapper
    padding 25px

  &__link
    position relative
    padding 10px
    margin -10px
    display inline-flex
    fontMedium()
    transition(opacity)
    cursor pointer
    &.router-link-active
      pointer-events none
      color $cBrand

  &__link-text
    display inline
    margin-right 5px
    user-select none

  &__link-icon
    display inline-block
    transition(opacity\, transform)
    .menu-app__link:hover &
      transform translateX(50%)
    .router-link-active &
      opacity 0
</style>
