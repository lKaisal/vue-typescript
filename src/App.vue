<template lang="pug">
  include ./tools/bemto.pug

  +b.app
    +e.container.container
      BreadcrumbsApp(v-show="logOutIsShown" class="app__breadcrumbs")
      LogOut(v-show="logOutIsShown" class="app__log-out")
      transition(mode="out-in")
        +e.links(v-if="isRootPage")
          +e.H1.title.page-title Список разделов
          +e.link-wrapper(v-for="(route, index) in routes")
            +e.ROUTER-LINK.link(tag="h2" v-html="route.meta && route.meta.title" :to="route.path")
        router-view(v-else class="app__page page")
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import ButtonApp from '@/components/ButtonApp.vue'
import IconSvg from '@/components/IconSvg.vue'
import LogOut from '@/components/LogOut.vue'
import BreadcrumbsApp from '@/components/BreadcrumbsApp.vue'
import LocalStorageService from './services/LocalStorageService'
import device from 'current-device'

@Component({
  components: {
    ButtonApp,
    IconSvg,
    LogOut,
    BreadcrumbsApp
  }
})

export default class App extends Vue {
  get isRootPage() { return this.$route && this.$route.fullPath === '/' }
  get isPageAuth() { return this.$route && this.$route.path.includes('auth') }
  get logOutIsShown() { return !this.isPageAuth && !this.isRootPage && !!LocalStorageService.getAccessToken() && !!LocalStorageService.getRefreshToken() }
  get routes() { return this.$store.state.system.modules.filter(r => !!r.meta && r.meta.title) }

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
    // display flex
    transition()
    &.v-enter
    &.v-leave-to
      opacity 0

  &__link-wrapper
    margin-left 15px
    &:not(:last-child)
      margin-bottom 25px

  &__link
    position relative
    display inline
    padding 10px
    margin -10px
    padding-left 15px
    fontReg()
    transition(opacity)
    cursor pointer
    &:hover
      opacity .75
    &:before
      content ''
      position absolute
      top 50%
      left 0
      transform translateY(-50%)
      width 5px
      height 5px
      border-radius 50%
      background-color $cBrand
      transition(background-color)

  &__up-arrow
    position fixed
    right $arrowOffset
    bottom $arrowOffset
    width $arrowSize
    height $arrowSize

  &__icon-up
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    transform rotateZ(90deg)
</style>
