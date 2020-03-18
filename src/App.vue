<template lang="pug">
  include ./tools/bemto.pug

  +b.app
    +e.container.container
      //- nav
      +e.nav
        transition(appear)
          LogOut(v-show="logOutIsShown && isAuthorized" @logOut="onLogOut" key="logout" class="app__log-out")
        transition(appear)
          MenuApp(v-show="menuIsShown && isAuthorized" key="menu" :closeIsDisabled="!logOutIsShown || !isAuthorized" @logOut="onLogOut"
            class="app__menu")

      //- content
      transition(mode="out-in")
        router-view(v-if="!isRootPage" key="router" @loggedIn="onLoggedIn" @goToPageAuth="goToPageAuth" class="app__page page")
</template>

<script lang="ts">

import { Vue, Component, Watch, Mixins } from 'vue-property-decorator'
import ButtonApp from '@/components/ButtonApp.vue'
import IconSvg from '@/components/IconSvg.vue'
import LogOut from '@/components/LogOut.vue'
import MenuApp from '@/components/MenuApp.vue'
import LocalStorageService from './services/LocalStorageService'
import device from 'current-device'
import animateIfVisible from '@/mixins/animateIfVisible'
import sleep from '@/mixins/sleep'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import { CurrentDevice } from '@/models'
import Router from '@/services/router'
import { uiMapper } from '@/modules/ui/module/store'
import { authMapper } from './modules/auth/module/store'

const grid = require('@/styles/grid-config.json')

const UiMappers = Vue.extend({
  methods: {
    ...uiMapper.mapMutations([ 'openMenu', 'closeMenu', 'setBreakpoint', 'setCurrentDevice' ]),
  }
})
const AuthMappers = Vue.extend({
  computed: {
    ...authMapper.mapGetters(['isAuthorized'])
  },
  methods: {
    ...authMapper.mapActions(['updateLocalStorageData'])
  }
})

@Component({
  components: {
    ButtonApp,
    IconSvg,
    LogOut,
    MenuApp
  },
  methods: {
    ...mapActions(['initializeModules'])
  }
})

export default class App extends Mixins(UiMappers, AuthMappers) {
  logOutIsShown: boolean = false
  menuIsShown: boolean = false
  initializeModules!: () => void

  get isDev() { return process && process.env && process.env.NODE_ENV === 'development' }
  get isRootPage() { return this.$route && this.$route.name === 'App' }
  get isPageAuth() { return this.$route && this.$route.path.includes('auth') }

  @Watch('$route', { immediate: true, deep: true })
  onRouteChange(val) {
    try {
      if (this.isRootPage) {
        this.openMenu()
        this.logOutIsShown = false
        this.menuIsShown = true
      } else {
        if (this.isPageAuth) {
          this.logOutIsShown = false
          this.menuIsShown = false
        } else if (this.$route.name) {
          this.logOutIsShown = true
          this.menuIsShown = true
        }
        this.closeMenu()
      }
    } catch(err) {
      if (this.isDev) console.log(err)
    }
  }

  created() {
    try {
      this.updateFromLocalStorage()

      if (this.isAuthorized) this.initializeModules()
  
      this.setCurrentDevice(device)
      window.addEventListener('resize', () => this.windowResizeHandler(grid))
      this.windowResizeHandler(grid)
    } catch(err) {
      if (this.isDev) console.log(err)
    }
  }

  onLoggedIn() {
    this.initializeModules()
    if (this.isPageAuth) this.goToPageRoot()
  }
  async onLogOut() {
    this.goToPageAuth()
    await this.$nextTick()
    LocalStorageService.clearToken()
  }
  updateFromLocalStorage() {
    const data = LocalStorageService.getAllData()
    if (data) this.updateLocalStorageData(data)
  }
  windowResizeHandler(grid) {
    if (!grid) return

    const queriesAll = Object.entries(grid.queries)
    const queriesCurrent = queriesAll.filter((query: any) => window.matchMedia(query[1]).matches)
    const breakpoint = queriesCurrent.find(rule => rule[0].length === 2)[0]

    this.setBreakpoint(breakpoint)
  }
  goToPageAuth() { this.$router.push({ path: '/auth/', replace: true, hash: null }) }
  goToPageRoot() { this.$router.push({ path: '/', replace: true, hash: null }) }
}
</script>

<style lang="stylus">
@import '~@/styles/tools'
@import '~@/styles/app'

.app

  &__container
    position relative
    min-height 100%
    min-height 100vh
    display flex
    flex-direction column
    width-between-property 'padding-top' 600 60 1000 90 true true
    // width-between-property 'padding-top' 1441 60 1920 60 false true
    width-between-property 'padding-bottom' 600 40 1000 60 true true
    // width-between-property 'padding-bottom' 1441 60 1920 60 false true

  &__nav
    position absolute
    top 0
    right 0
    left 0
    padding-right inherit
    padding-left inherit
    transition()

  &__log-out
  &__breadcrumbs
    z-index 1
    position absolute
    width-between-property 'top' 600 20 1000 30 true true
    transition(opacity)
    &.v-enter
    &.v-leave-to
      opacity 0
    &.v-enter-active
      transition-delay $tFast

  &__breadcrumbs
    left 0
    padding-left inherit

  &__log-out
    right 0
    padding-right inherit

  &__page
    width 100%
    min-height 100%
    display flex
    flex-direction column
    flex-grow 1

  &__menu
    z-index 5
    position fixed
    top 0
    bottom 0
    left 0
    height 100%
    transition(opacity)
    &.v-enter
    &.v-leave-to
      opacity 0
    &.v-enter-active
      transition-delay $tFast
</style>
