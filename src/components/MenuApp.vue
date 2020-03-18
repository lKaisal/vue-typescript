<template lang="pug">
  include ../tools/bemto.pug

  +b.menu-app
    +e.container(:class="{ 'is-open': menuIsOpenGetter }")
      transition
        +e.toggle(v-show="!closeIsDisabled" key="icon-toggle")
          +e.I.toggle-icon(:key="menuIsOpenGetter" @click="onToggleClick"
            :class="{ 'el-icon-s-fold': menuIsOpenGetter, 'el-icon-s-unfold': !menuIsOpenGetter }")
      transition(mode="out-in")
        +e.links-wrapper(v-if="menuIsOpenGetter" v-click-outside="onClickOutside")
          +e.links(v-if="menu && menu.length")
            +e.link-wrapper(v-for="(item, index) in menu")
              +e.ROUTER-LINK.link(tag="div" :to="`/${item.pertuttiLink}`")
                +e.link-text(v-html="item.title")
                +e.I.link-icon.el-icon-arrow-right
            +e.link-wrapper
              LogOut(:isInMenu="true")
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop, Mixins } from 'vue-property-decorator'
import Router from '@/services/router'
import LogOut from '@/components/LogOut.vue'
import vClickOutside from 'v-click-outside'
import { mapState, mapMutations, mapGetters } from 'vuex'
import LocalStorageService from '../services/LocalStorageService'
import { MenuItem } from '@/models'
import { systemMapper } from '@/modules/system/module/store'
import { authMapper } from '@/modules/auth/module/store'

const SystemMappers = Vue.extend({
  computed: {
    ...systemMapper.mapState(['menuIsOpen']),
  },
  methods: {
    ...systemMapper.mapMutations(['toggleMenu', 'openMenu', 'closeMenu'])
  }
})
const AuthMappers = Vue.extend({
  computed: {
    ...authMapper.mapState(['menu'])
  },
})

@Component({
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    LogOut
  },
})

export default class MenuApp extends Mixins(SystemMappers, AuthMappers) {
  @Prop() closeIsDisabled: boolean

  get isDev() { return process && process.env && process.env.NODE_ENV === 'development' }
  get menuIsOpenGetter() {
    try {
      return this.menuIsOpen
    } catch(err) {
      if (this.isDev) console.log(err)
    }
  }

  created() {
    document.addEventListener('keydown', this.keyDownHandler)
  }
  beforeDestroy() {
    document.addEventListener('keydown', this.keyDownHandler)
  }

  onToggleClick() {
    try {
      if (!this.closeIsDisabled) this.toggleMenu()
    } catch(err) {
      if (this.isDev) console.log(err)
    }
  }
  onClickOutside() {
    try {
      if (!this.closeIsDisabled && this.menuIsOpen) this.closeMenu()
    } catch(err) {
      if (this.isDev) console.log(err)
    }
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
    transition()
    &.v-enter
    &.v-leave-to
      opacity 0

  &__toggle-icon
    font-size 36px
    width-between-property 'font-size' 600 28 1000 32 true false
    width-between-property 'font-size' 1001 32 1440 36 false true
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
