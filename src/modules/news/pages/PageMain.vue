<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page
    +e.container
      +e.title.H1.page-title(v-html="activeSection && activeSection.title")
      //- ListNews(:list="currentList" @itemClicked="goToPageSupplier" class="page-main__list")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { MsgBoxContent, Button } from '@/models'
import { newsMapper } from '../module/store'
import sleep from '@/mixins/sleep'
import ButtonApp from '@/components/ButtonApp.vue'
import MessageBox from '@/components/MessageBox.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import animateIfVisible from '@/mixins/animateIfVisible'
import { authMapper } from '@/modules/auth/module/store'
import { News } from '../models'

const NewsMappers = Vue.extend({
})
const AuthMappers = Vue.extend({
  computed: {
    ...authMapper.mapGetters(['activeMenuSectionByLink'])
  }
})

@Component({
  components: {
    MessageBox,
    ButtonApp,
  },
  mixins: [
    MsgBoxTools
  ]
})

export default class PageMain extends Mixins(MsgBoxTools, MsgBoxToolsApp, AuthMappers, NewsMappers) {
  get link() { return this.$route && this.$route.matched && this.$route.matched[0].path.slice(1) }
  get activeSection() { return this.link && this.activeMenuSectionByLink(this.link) }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-main
  // 

</style>
