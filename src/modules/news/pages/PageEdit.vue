<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-edit.page
    //- 
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import sleep from '@/mixins/sleep'
import ButtonApp from '@/components/ButtonApp.vue'
import MessageBox from '@/components/MessageBox.vue'
import { RequestStatus } from '../models'
import { MsgBoxContent, Button } from '@/models'
import { newsMapper } from '../module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import vClickOutside from 'v-click-outside'
import animateIfVisible from '@/mixins/animateIfVisible'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

const NewsMappers = Vue.extend({
})

@Component({
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    MessageBox,
    ButtonApp,
  }
})

export default class PageEdit extends Mixins(MsgBoxTools, MsgBoxToolsApp, NewsMappers) {
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-edit
  // 

</style>
