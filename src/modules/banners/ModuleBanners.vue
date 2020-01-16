<template lang="pug">
  include ../../tools/bemto.pug

  +b.module-banners
    ListBanners(class="module-banners__list")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ListBanners from './components/ListBanners.vue'
import BannersStore from './module/store'
import Axios from 'axios'

// const Mappers = Vue.extend({
//   computed: {
//     ...BannersStore.mapGetters(["double"])
//   },
//   methods: {
//     ...BannersStore.mapActions({
//       incAsync: 'incrementAsync'
//     })
//   }
// });

@Component({
  components: {
    ListBanners
  }
})

export default class ModuleBanners extends Vue {
  async created() {
    Axios.get('/api/banners-list')
      .then(response => console.log(response));
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/styles/tools'

.module-banners

  &__list
    width 100%
</style>
