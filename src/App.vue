<template lang="pug">
  include ./tools/bemto.pug

  +b.app
    +e.container.container
      transition(mode="out-in")
        router-view(class="app__page")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
  }
})

export default class App extends Vue {
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
    width-between-property 'padding-top' 600 10 1000 20 true true
    width-between-property 'padding-top' 1441 20 1920 30 false true
    width-between-property 'padding-bottom' 600 10 1000 20 true true
    width-between-property 'padding-bottom' 1441 20 1920 30 false true

  &__page
    &.page-create
      width 100%
      align-self center
</style>
