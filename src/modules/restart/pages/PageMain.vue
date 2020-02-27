<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page
    +e.container(v-if="!isLoading && list.data && list.data.length")
      ListRestart(:list="listSorted" @editClicked="onEditClick" class="page-main__list")
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" :secondBtn="secondBtn" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="closeMsgBox"
        class="list-features__msg-box modal modal-msg")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { MsgBoxContent, Button } from '@/models'
import { restartMapper } from '../module/store'
import sleep from '@/mixins/sleep'
import ButtonApp from '@/components/ButtonApp.vue'
import MessageBox from '@/components/MessageBox.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import ListRestart from '../components/ListRestart.vue'
import animateIfVisible from '@/mixins/animateIfVisible'
import { EditPayload } from '../models'

const Mappers = Vue.extend({
  computed: {
    ...restartMapper.mapState(['list']),
    ...restartMapper.mapGetters(['isLoading', 'listSorted'])
  },
  methods: {
    ...restartMapper.mapActions(['editList'])
  }
})

@Component({
  components: {
    MessageBox,
    ButtonApp,
    ListRestart
  },
  mixins: [
    MsgBoxTools
  ]
})

export default class PageMain extends Mixins(MsgBoxTools, MsgBoxToolsApp, Mappers) {
  editPayload: EditPayload = null // for repeated request
  secondBtn: Button = null

  // LIST click handler
  onEditClick(payload?: EditPayload) {
    if (payload) this.editPayload = payload // stored here in case of repeated request

    this.requestStatus = 'beforeEdit'
    this.secondBtn = { type: 'danger', isPlain: true }
    // this.msgBoxOtherMsgs['beforeEdit'] = this.beforeEditMsg[this.activeHashIndex]
    this.openMsgBox()
  }
  editConfirm() {
    this.editList(this.editPayload)
      .then(() => {
        this.editPayload = null
      })
      .catch(() => {
        this.requestStatus = 'failEdit'
        this.openMsgBox()
      })
  }
  // MSGBOX click handler
  onFirstBtnClick() {
    this.closeMsgBox()

    switch (this.requestStatus) {
      case 'beforeEdit':
      case 'failEdit':
        this.editConfirm()
        break
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-main

  &__sort
    margin-bottom 30px

  &__sort-item
    user-select none
    &.is-disabled
      pointer-events none
      opacity 1

  &__list
    transition(opacity)
    &.v-enter
    &.v-leave-to
      opacity 0
</style>
