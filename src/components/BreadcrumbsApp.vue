<template lang="pug">
  include ../tools/bemto.pug

  +b.breadcrumbs-app
    +e.row
      +e.ROUTER-LINK.item(v-for="(route, index) in routes" :key="index" v-html="route.name" :to="route.path" :class="{ 'is-active': getRouteIsActive(route.path) }")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import Router from '@/services/router'

@Component({
  components: {
  }
})

export default class BreadcrumbsApp extends Vue {
  get routes() { return this.$store.state.system.modules }

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
    padding 5px
    margin -5px
    font-size 14px
    &:not(:last-child)
      margin-right 10px
    &.is-active
      fontMedium()
</style>
