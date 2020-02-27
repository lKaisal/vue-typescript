<template lang="pug">
  include ../tools/bemto.pug

  +b.module-restart.page(v-loading.fullscreen.lock="isLoading")
    +e.title.H1.page-title Перезапуск сервисов
    router-view
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" class="module-restart__msg-box modal modal-msg")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { restartMapper } from '@/modules/restart/module/store'
import ListRestart from '@/modules/restart/components/ListRestart.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '@/modules/restart/mixins/MsgBoxTools'
import MessageBox from '@/components/MessageBox.vue'

const Mappers = Vue.extend({
  computed: {
    ...restartMapper.mapState(['list']),
    ...restartMapper.mapGetters(['isLoading'])
  },
  methods: {
    ...restartMapper.mapActions(['getList']),
  }
})

@Component({
  components: {
    ListRestart,
    MessageBox
  }
})

export default class ModuleRestart extends Mixins(Mappers, MsgBoxToolsApp, MsgBoxTools) {
  created() {
    this.updateList()
  }

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

.module-restart

  &__list
    grid-size(4, 4, 6, 8, 10)
    margin 0 auto
</style>
