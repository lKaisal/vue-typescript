<template lang="pug">
  include ../tools/bemto.pug

  +b.module-banners(v-loading.fullscreen.lock="isLoading")
    transition(mode="out-in")
      router-view(@updateList="updateList" class="module-banners__page page")
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="loadData" class="module-banners__msg-box modal modal-msg")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import MessageBox from '@/modules/banners/components/MessageBox.vue'
import { bannersMapper } from '@/modules/banners/module/store'
import MsgBoxTools from '@/modules/banners/mixins/msgBoxTools'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['list']),
    ...bannersMapper.mapGetters(['isLoading'])
  },
  methods: {
    ...bannersMapper.mapMutations(['clearForm']),
    ...bannersMapper.mapActions(['getList', 'getActiveAmount'])
  }
})

@Component({
  components: {
    MessageBox,
  }
})

export default class ModuleBanners extends Mixins(Mappers, MsgBoxTools) {
  count: number = 0
  created() {
    this.loadData()
    this.clearForm()
  }

  loadData() {
    if (this.list.isLoading) return

    if (this.msgBoxIsShown) this.closeMsgBox()

    const promisesArr = [this.getList(), this.getActiveAmount()]
    Promise.all(promisesArr)
      .then(() => {
      })
      .catch((err) => {
        if (err.status === 401) this.goToPageAuth()
        else this.openMsgBox()
      })
  }
  updateList() {
    if (this.list.isLoading) return

    if (this.msgBoxIsShown) this.closeMsgBox()

    this.getList()
      .then(() => this.count = 0)
      .catch((err) => {
        if (err.status === 401) this.goToPageAuth()
        else {
          this.requestStatus = 'failFetchList'
          this.openMsgBox()
        }
      })
  }
  goToPageAuth() {
    this.$router.push({ name: 'PageAuth' })
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
