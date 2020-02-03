<template lang="pug">
  include ../tools/bemto.pug

  +b.module-banners
    //- +e.intro
      +e.H1.title.page-title Module Banners
      +e.btn-wrapper
        el-button(type="primary" @click="onClick") Показать список
    router-view(class="module-banners__page")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import PageBanners from '@/modules/banners/pages/PageMain.vue'
import PageCreate from '@/modules/banners/pages/PageCreate.vue'
import PageEdit from '@/modules/banners/pages/PageEdit.vue'

@Component({
  components: {
    PageBanners,
    PageCreate,
    PageEdit
  }
})

export default class ModuleBanners extends Vue {
  get isOnPageBanners() { return this.$route.path && this.$route.path.includes('banners/list') }
  get isOnPageCreate() { return this.$route.path && this.$route.path.includes('banners/create') }
  get isOnPageEdit() { return this.$route.path && this.$route.path.includes('banners/edit') }

  created() {
    // let { routes } =this.$router.options;
    // let routeData = routes.find(r => r.path === this.$route.path);
    // console.log(routes, routeData)
    // routeData.children = [
    //   { path: 'bar', component: Bar },
    //   { path: 'baz', component: Baz },
    // ]
    // this.$router.addRoutes([routeData])
  }

  onClick() { this.$router.push({ path: '/banners/list' }) }

  @Watch('$route')
  onRouteChange(val) {
    console.log(val)
  }
}
</script>

<style lang="stylus">
@import '../styles/tools'

.module-banners

  &__page
    &.page-create
    &.page-edit
      width 100%
      display flex
      flex-grow 1
</style>
