<template lang="pug">
  include ../tools/bemto.pug

  +b.module-banners
    +e.H1 Module Banners
    +e.btn-wrapper
      el-button(type="primary" @click="onClick") Показать список
    PageBanners(v-if="isOnPageBanners")
    PageCreate(v-else-if="isOnPageCreate")
    PageEdit(v-else-if="isOnPageEdit")
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import PageBanners from '@/modules/banners/pages/PageMain.vue'
import PageCreate from '@/modules/banners/pages/PageCreate.vue'
import PageEdit from '@/modules/banners/pages/PageEdit.vue'

@Component({
  components: {
  }
})

export default class ModuleBanners extends Vue {
  get isOnPageBanners() { return this.$route.name && this.$route.name.includes('banners/list') }
  get isOnPageCreate() { return this.$route.name && this.$route.name.includes('banners/create') }
  get isOnPageEdit() { return this.$route.name && this.$route.name.includes('banners/edit') }

  onClick() { this.$router.push({ name: 'PageBanners' }) }
}
</script>

<style lang="stylus">
@import '../styles/tools'

.module-banners

  .page-create
    width 100%
    align-self center
</style>
