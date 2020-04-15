<template lang="pug">
  include ../tools/bemto.pug

  +b.module-suppliers.page(v-loading.fullscreen.lock="isLoading")
    transition(mode="out-in")
      router-view(@loadList="updateList" class="module-suppliers__page page")
    transition
      MessageBox(v-show="msgBoxIsShown && fetchListFailed" :secondBtn="secondBtn" :content="msgBoxContent"
        @close="goToPageApp" @updateList="updateList()" @firstBtnClicked="onFirstBtnClick()"
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
  get moduleLink() { return this.$route && this.$route.matched && this.$route.matched[0].path.slice(1) }
  get activeSection() { return this.moduleLink && this.activeMenuSectionByLink(this.moduleLink) }

  @Watch('list', { immediate: true, deep: true })
  async onListChange(val) {
    if (val.data && val.data.length) {
      await this.$nextTick()
      animateIfVisible()
    }
  }

  created() {
    console.log('module created ' + new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds())
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
      .then(() => {
        console.log('list data loaded ' + new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds())
      })
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

  &__page
    &.page-supplier
      width 100%
      display flex
      flex-grow 1
</style>
