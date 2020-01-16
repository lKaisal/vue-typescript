<template lang="pug">
  include ../../tools/bemto.pug

  +b.module-banners
    ListBanners(class="module-banners__list")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ListBanners from './components/ListBanners.vue'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'

// const bannersModule = namespace('./module/store')

@Component({
  components: {
    ListBanners
  }
})

export default class ModuleBanners extends Vue {
  // @bannersModule.Action('getList') getList: any

  async mounted() {
    await this.$nextTick()
    this.$store.dispatch('banners/getList')
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/styles/tools'

.module-banners

  &__list
    width 100%
</style>
