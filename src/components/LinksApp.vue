<template lang="pug">
  include ../tools/bemto.pug

  +b.links-app
    +e.H1.title.page-title Список разделов
    +e.link-wrapper(v-for="(route, index) in routes")
      +e.ROUTER-LINK.link(tag="h2" v-html="route.meta && route.meta.title" :to="route.path")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import Router from '@/services/router'

@Component({
  components: {
  }
})

export default class BreadcrumbsApp extends Vue {
  get routes() { return this.$store.getters['system/modules'] }

  getRouteIsActive(path) {
    return this.$route.path.includes(path)
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.links-app

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
</style>
