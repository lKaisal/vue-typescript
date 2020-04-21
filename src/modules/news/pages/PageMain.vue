<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page
    +e.container
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
import {  } from '../models'

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
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-main
  // 

</style>
