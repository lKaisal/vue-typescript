<template lang="pug">
  include ./tools/bemto.pug

  +b.app.container
    +e.page
      <router-view></router-view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
  }
})

export default class App extends Vue {
  // get moduleALoaded() { return !!this.$store.state.moduleA }

  // loadModuleA() { this.$store.dispatch('system/initializeModule', moduleA) }
  // deleteModuleA() { this.$store.dispatch('system/removeModule', moduleA) }
}
</script>

<style lang="stylus" scoped>
@import '~@/styles/tools'

.app
  padding-top 100px
  padding-bottom 100px

  &__modules
    display flex
    margin-bottom 50px

  &__module
    &:not(:last-child)
      margin-right 150px

  &__page
    // margin-top 5vh
</style>
