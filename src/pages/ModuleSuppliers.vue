<template lang="pug">
  include ../tools/bemto.pug

  +b.module-suppliers.page(v-loading.fullscreen.lock="isLoading")
    //- +e.container.js-voa.js-voa-start(v-if="list.data && list.data.length")
    router-view
    transition
      MessageBox(v-show="msgBoxIsShown && fetchListFailed" :secondBtn="secondBtn" :content="msgBoxContent" @close="goToPageApp" @updateList="updateList()" @firstBtnClicked="onFirstBtnClick()"
        @secondBtnClicked="goToPageApp()" class="module-suppliers__msg-box modal modal-msg")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { suppliersMapper } from '@/modules/suppliers/module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '@/modules/suppliers/mixins/MsgBoxTools'
import MessageBox from '@/components/MessageBox.vue'
import { Button } from '@/models'
import animateIfVisible from '@/mixins/animateIfVisible'
import { authMapper } from '@/modules/auth/module/store'

const SuppliersMappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapState(['list', 'countries']),
    ...suppliersMapper.mapGetters(['isLoading'])
  },
  methods: {
    ...suppliersMapper.mapActions(['getList']),
  }
})
const AuthMappers = Vue.extend({
  computed: {
    ...authMapper.mapGetters(['activeMenuSectionByLink'])
  }
})

@Component({
  components: {
    MessageBox
  }
})

export default class ModuleSuppliers extends Mixins(SuppliersMappers, AuthMappers, MsgBoxToolsApp, MsgBoxTools) {
  secondBtn: Button = { type: 'success', isPlain: true }
  get fetchListFailed() { return this.requestStatus === 'failFetchList' }
  get link() { return this.$route && this.$route.matched && this.$route.matched[0].path.slice(1) }
  get activeSection() { return this.link && this.activeMenuSectionByLink(this.link) }

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

.module-suppliers

  &__list
    grid-size(4, 4, 6, 8, 10)
    margin 0 auto
</style>
