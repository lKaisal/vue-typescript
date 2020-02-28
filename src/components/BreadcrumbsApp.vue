<template lang="pug">
  include ../tools/bemto.pug

  +b.breadcrumbs-app
    +e.row
      +e.ROUTER-LINK.item(v-for="(route, index) in routes" tag="div" :key="index" v-html="route.meta && route.meta.title" :to="route.path" :class="{ 'is-active': getRouteIsActive(route.path) }")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import Router from '@/services/router'

@Component({
  components: {
  }
})

export default class BreadcrumbsApp extends Vue {
  get routes() { return this.$store.state.system.modules.filter(r => !!r.meta && r.meta.title) }

  getRouteIsActive(path) {
    return this.$route.path.includes(path)
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.breadcrumbs-app

  &__row
    display flex

  &__item
    position relative
    padding 5px
    margin -5px
    font-size 14px
    &:hover
      &:not(.is-active)
        opacity .75
        cursor pointer
    &:not(:last-child)
      margin-right 30px
    &.is-active
      fontMedium()
      pointer-events none
    &:before
      content ''
      position absolute
      top 50%
      left -7px
      transform translateY(-50%)
      width 5px
      height 5px
      border-radius 50%
      background-color $cPText
      transition(background-color)
    &.is-active
      &:before
        background-color $cBrand
</style>
