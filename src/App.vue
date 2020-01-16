<template lang="pug">
  include ./tools/bemto.pug

  +b.app
    +e.container.container
      NavbarApp(class="app__navbar")
      <router-view></router-view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import NavbarApp from '@/components/NavbarApp.vue'

@Component({
  components: {
    NavbarApp
  }
})

export default class App extends Vue {
}
</script>

<style lang="stylus" scoped>
@import './styles/app'
@import '~@/styles/tools'

.app

  &__container
    width-between-property 'padding-top' 600 10 1000 20 true true
    width-between-property 'padding-top' 1441 20 1920 30 false true
    width-between-property 'padding-bottom' 600 10 1000 20 true true
    width-between-property 'padding-bottom' 1441 20 1920 30 false true

  &__navbar
    margin-bottom 50px
</style>
