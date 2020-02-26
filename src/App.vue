<template lang="pug">
  include ./tools/bemto.pug

  +b.app
    +e.container.container
      transition(mode="out-in")
        +e.btn-wrapper(v-if="isPageHome")
          //- el-button(type="primary" @click="onClick") Enter BannersModule
          ButtonApp(text="Enter BannersModule" @clicked="onClick" class="app__btn")
        router-view(v-else class="app__page page")
      //- +e.up-arrow
        IconSvg(icon="back" class="app__icon-up")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ButtonApp from '@/components/ButtonApp.vue'
import IconSvg from '@/components/IconSvg.vue'
import LocalStorageService from './services/localStorageService'

@Component({
  components: {
    ButtonApp,
    IconSvg
  }
})

export default class App extends Vue {
  get isPageHome() { return this.$route && this.$route.fullPath === '/' }

  created() {
    this.initLocalStorageService()
  }
  initLocalStorageService() {
    const localStorageService = LocalStorageService.getService();
    const accessToken = localStorageService.getAccessToken()
    const refreshToken = localStorageService.getRefreshToken()
    if (!accessToken || !refreshToken) this.$router.push({ name: 'PageAuth' }).catch(() => {})
  }
  onClick() { this.$router.push({path: '/banners'}) }
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
    width-between-property 'padding-top' 600 40 1000 60 true true
    // width-between-property 'padding-top' 1441 60 1920 60 false true
    width-between-property 'padding-bottom' 600 40 1000 60 true true
    // width-between-property 'padding-bottom' 1441 60 1920 60 false true

  &__page
    width 100%
    min-height 100%
    display flex
    flex-direction column
    flex-grow 1

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
