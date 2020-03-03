<template lang="pug">
  include ../tools/bemto.pug

  +b.module-features.page(v-loading.fullscreen.lock="isLoading")
    +e.container(v-if="list.data && list.data.length")
      +e.title.H1.page-title.js-voa.js-voa-start Управление разделами приложения
      router-view
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" :secondBtn="secondBtn" @close="closeMsgBox()" @firstBtnClicked="onFirstBtnClick()" @secondBtnClicked="goToPageApp()"
        class="module-features__msg-box modal modal-msg")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { featuresMapper } from '@/modules/features/module/store'
import ListFeatures from '@/modules/features/components/ListFeatures.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '@/modules/features/mixins/MsgBoxTools'
import MessageBox from '@/components/MessageBox.vue'
import { Button } from '@/models'
import animateIfVisible from '@/mixins/animateIfVisible'

const Mappers = Vue.extend({
  computed: {
    ...featuresMapper.mapState(['list']),
    ...featuresMapper.mapGetters(['isLoading'])
  },
  methods: {
    ...featuresMapper.mapActions(['getList']),
  }
})

@Component({
  components: {
    ListFeatures,
    MessageBox
  }
})

export default class ModuleFeatures extends Mixins(Mappers, MsgBoxToolsApp, MsgBoxTools) {
  secondBtn: Button = { type: 'danger', isPlain: true }

  @Watch('list', {deep: true})
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
      .catch(() => {
        this.requestStatus = 'failFetchList'
        this.openMsgBox()
      })
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.module-features

  &__list
    grid-size(4, 4, 6, 8, 10)
    margin 0 auto
</style>
