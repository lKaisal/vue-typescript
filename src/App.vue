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
import { uiMapper } from '@/services/store/modules/ui/store'
import axios from 'axios'

const grid = require('@/styles/grid-config.json')


@Component({
  metaInfo: {
    title: 'Title',
  },
  components: {
  },
})

export default class App extends Vue {
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

  &__page
    width 100%
    min-height 100%
    display flex
    flex-direction column
    flex-grow 1

  &__menu
    z-index 10
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
