<template lang="pug">
  include ../tools/bemto.pug

  +b.module-banners.page(v-loading.fullscreen.lock="isLoading")
    transition(mode="out-in")
      router-view(v-if="list.data && list.data.length" @updateList="loadData" @goToPageAuth="goToPageAuth" class="module-banners__page page")
    transition
      MessageBox(v-show="msgBoxIsShown && failedFetchList" :content="msgBoxContent" :secondBtn="secondBtn" @close="goToPageApp"
        @firstBtnClicked="loadData" @secondBtnClicked="goToPageApp"
        class="module-banners__msg-box modal modal-msg")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import MessageBox from '@/components/MessageBox.vue'
import { bannersMapper } from '@/modules/banners/module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '@/modules/banners/mixins/MsgBoxTools'
import { Button } from '../models'

const BannersMappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['list']),
    ...bannersMapper.mapGetters(['isLoading'])
  },
  methods: {
    ...bannersMapper.mapMutations(['clearForm']),
    ...bannersMapper.mapActions(['loadGlobalData', 'getList'])
  }
})

@Component({
  components: {
    MessageBox,
  }
})

export default class ModuleBanners extends Mixins(BannersMappers, MsgBoxTools, MsgBoxToolsApp) {
  secondBtn: Button = { type: 'success', isPlain: true }
  get failedFetchList() { return this.requestStatus === 'failFetchList' }

  created() {
    this.loadData()
    this.clearForm()
  }

  goToPageApp() { this.$router.push({ path: '/' }) }
  goToPageAuth() { this.$emit('goToPageAuth') }
  loadData() {
    if (this.list.isLoading) return

    if (this.msgBoxIsShown) this.closeMsgBox()

    this.loadGlobalData()
      .catch((err) => {
        if (err && err.status && err.status.toString().slice(0, 2) == 40) this.goToPageAuth()
        else {
          this.requestStatus = 'failFetchList'
          this.openMsgBox()
        }
      })
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.module-banners

  &__page
    &.page-create
    &.page-edit
      width 100%
      display flex
      flex-grow 1
</style>
