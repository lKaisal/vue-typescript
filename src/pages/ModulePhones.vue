<template lang="pug">
  include ../tools/bemto.pug

  +b.module-restart.page(v-loading.fullscreen.lock="isLoading")
    +e.container.js-voa.js-voa-start(v-if="list.data && list.data.length")
      +e.title.H1.page-title.js-voa.js-voa-start Выбор поставщика
      router-view
    transition
      MessageBox(v-show="msgBoxIsShown && fetchListFailed" :secondBtn="secondBtn" :content="msgBoxContent" @close="closeMsgBox()" @updateList="updateList()" @firstBtnClicked="onFirstBtnClick()"
        @secondBtnClicked="goToPageApp()" class="module-restart__msg-box modal modal-msg")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { phonesMapper } from '@/modules/phones/module/store'
import ListRestart from '@/modules/restart/components/ListRestart.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '@/modules/restart/mixins/MsgBoxTools'
import MessageBox from '@/components/MessageBox.vue'
import { Button } from '@/models'
import animateIfVisible from '@/mixins/animateIfVisible'

const Mappers = Vue.extend({
  computed: {
    ...phonesMapper.mapState(['list']),
    ...phonesMapper.mapGetters(['isLoading'])
  },
  methods: {
    ...phonesMapper.mapActions(['getList']),
  }
})

@Component({
  components: {
    ListRestart,
    MessageBox
  }
})

export default class ModulePhones extends Mixins(Mappers, MsgBoxToolsApp, MsgBoxTools) {
  secondBtn: Button = { type: 'danger', isPlain: true }
  get fetchListFailed() { return this.requestStatus === 'failFetchList' }

  @Watch('list', { immediate: true, deep: true })
  async onListChange(val) {
    if (val.data && val.data.length) {
      await this.$nextTick()
      animateIfVisible()
    }
  }

  created() {
    // this.updateList()
  }

  goToPageApp() { this.$router.push({ path: '/' }) }
  onFirstBtnClick() {
    if (this.msgBoxIsShown) this.closeMsgBox()

    switch (this.requestStatus) {
      case 'failFetchList':
        this.updateList()
        break
    }
  }
  updateList() {
    if (this.list.isLoading) return

    this.getList()
      .catch(() => {
        this.secondBtn = { type: 'danger', isPlain: true }
        this.requestStatus = 'failFetchList'
        this.openMsgBox()
      })
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.module-restart

  &__list
    grid-size(4, 4, 6, 8, 10)
    margin 0 auto
</style>
