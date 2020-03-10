<template lang="pug">
  include ../tools/bemto.pug

  +b.module-suppliers-login.page(v-loading.fullscreen.lock="isLoading")
    +e.container.js-voa.js-voa-start(v-if="list.data && list.data.length")
      +e.title.H1.page-title.js-voa.js-voa-start Выбор поставщика
      router-view
    transition
      MessageBox(v-show="msgBoxIsShown && fetchListFailed" :secondBtn="secondBtn" :content="msgBoxContent" @close="goToPageApp" @updateList="updateList()" @firstBtnClicked="onFirstBtnClick()"
        @secondBtnClicked="goToPageApp()" class="module-suppliers-login__msg-box modal modal-msg")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { suppliersMapper } from '@/modules/suppliers-login/module/store'
import ListRestart from '@/modules/restart/components/ListRestart.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '@/modules/restart/mixins/MsgBoxTools'
import MessageBox from '@/components/MessageBox.vue'
import { Button } from '@/models'
import animateIfVisible from '@/mixins/animateIfVisible'

const Mappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapState(['list', 'countries']),
    ...suppliersMapper.mapGetters(['isLoading'])
  },
  methods: {
    ...suppliersMapper.mapActions(['getList']),
  }
})

@Component({
  components: {
    ListRestart,
    MessageBox
  }
})

export default class ModuleSuppliersLogin extends Mixins(Mappers, MsgBoxToolsApp, MsgBoxTools) {
  secondBtn: Button = { type: 'success', isPlain: true }
  get fetchListFailed() { return this.requestStatus === 'failFetchList' }

  @Watch('list', { immediate: true, deep: true })
  async onListChange(val) {
    if (val.data && val.data.length) {
      await this.$nextTick()
      animateIfVisible()
    }
  }

  created() {
    this.updateList()
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
      .catch((err) => {
        if (err && err.status && err.status.toString().slice(0, 2) == 40) this.$emit('goToPageAuth')
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

.module-suppliers-login

  &__list
    grid-size(4, 4, 6, 8, 10)
    margin 0 auto
</style>
