<template lang="pug">
  include ./tools/bemto.pug

  +b.app
    +e.container.container
      transition(mode="out-in")
        +e.btn-wrapper(v-if="isPageHome")
          //- el-button(type="primary" @click="onClick") Enter BannersModule
          ButtonApp(text="Enter BannersModule" @clicked="onClick" class="app__btn")
        router-view(v-else class="app__page page")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ButtonApp from '@/components/ButtonApp.vue'

@Component({
  components: {
    ButtonApp
  }
})

export default class App extends Vue {
  get isPageHome() { return this.$route && this.$route.fullPath === '/' }

  onClick() { this.$router.push({path: '/banners'}) }
}
</script>

<style lang="stylus">
@import '~@/styles/tools'
@import '~@/styles/app'

.app

  &__container
    min-height 100%
    min-height 100vh
    display flex
    flex-direction column
    width-between-property 'padding-top' 600 10 1000 20 true true
    width-between-property 'padding-top' 1441 20 1920 30 false true
    width-between-property 'padding-bottom' 600 10 1000 20 true true
    width-between-property 'padding-bottom' 1441 20 1920 30 false true

  &__page
    width 100%
    min-height 100%
    display flex
    flex-direction column
    flex-grow 1
</style>
