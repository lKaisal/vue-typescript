<template lang="pug">
  include ./tools/bemto.pug

  +b.app
    +e.container.container
      //- nav
      +e.TRANSITION-GROUP.nav(appear tag="div")
        BreadcrumbsApp(v-show="crumbsShown" key="breadcrumbs" class="app__breadcrumbs")
        LogOut(v-show="navIsShown" key="logout" class="app__log-out")

      //- content
      transition(mode="out-in")
        LinksApp(v-if="isRootPage" class="app__links")
        router-view(v-else class="app__page page")
</template>

<script lang="ts">

import { Vue, Component, Watch } from 'vue-property-decorator'
import ButtonApp from '@/components/ButtonApp.vue'
import IconSvg from '@/components/IconSvg.vue'
import LogOut from '@/components/LogOut.vue'
import BreadcrumbsApp from '@/components/BreadcrumbsApp.vue'
import LinksApp from '@/components/LinksApp.vue'
import LocalStorageService from './services/LocalStorageService'
import device from 'current-device'
import animateIfVisible from '@/mixins/animateIfVisible'
import sleep from '@/mixins/sleep'

@Component({
  components: {
    ButtonApp,
    IconSvg,
    LogOut,
    BreadcrumbsApp,
    LinksApp
  }
})

export default class App extends Vue {
  get isRootPage() { return this.$route && this.$route.fullPath === '/' }
  get isPageAuth() { return this.$route && this.$route.path.includes('auth') }
  get navIsShown() { return !this.isPageAuth && !this.isRootPage && !!LocalStorageService.getAccessToken() && !!LocalStorageService.getRefreshToken() }
  get crumbsShown() { return this.navIsShown && this.routes && this.routes.length }
  get routes() { return this.$store.getters['system/modules'] }

  created() {
    this.initLocalStorageService()
    this.$store.commit('system/setCurrentDevice', device)
  }

  onBannersClick() { this.$router.push({path: '/banners'}) }
  onFeaturesClick() { this.$router.push({path: '/features'}) }
  onRestartClick() { this.$router.push({path: '/restart'}) }
  initLocalStorageService() {
    const accessToken = LocalStorageService.getAccessToken()
    const refreshToken = LocalStorageService.getRefreshToken()
    if (!accessToken || !refreshToken) this.$router.push({ name: 'PageAuth' }).catch(() => {})
  }
}
</script>

<style lang="stylus">
@import '~@/styles/tools'
@import '~@/styles/app'

$arrowOffset = $offsetXl / 4
$arrowSize = $offsetXl / 2

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

  &__links
    transition()
    &.v-enter
    &.v-leave-to
      opacity 0
</style>
