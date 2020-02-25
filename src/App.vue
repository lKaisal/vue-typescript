<template lang="pug">
  include ./tools/bemto.pug

  +b.app
    +e.container.container
      transition(mode="out-in")
        +e.btns(v-if="isRootPage")
          ButtonApp(text="Enter BannersModule" @clicked="onBannersClick" class="app__btn")
          ButtonApp(text="Enter FeaturesModule" @clicked="onFeaturesClick" class="app__btn")
        router-view(v-else class="app__page page")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ButtonApp from '@/components/ButtonApp.vue'
import IconSvg from '@/components/IconSvg.vue'

@Component({
  components: {
    ButtonApp,
    IconSvg
  }
})

export default class App extends Vue {
  get isRootPage() { return this.$route && this.$route.fullPath === '/' }

  onBannersClick() { this.$router.push({path: '/banners'}) }
  onFeaturesClick() { this.$router.push({path: '/features'}) }
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

  &__btns
    display flex

  &__btn
    &:not(:last-child)
      margin-right 10px

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
