<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page
    +e.container.js-voa.js-voa-start(v-if="list.data && list.data.length")
      ListRestart(:list="listSorted" :key="listSorted + editPayload" @editClicked="onEditClick" @updateClicked="onUpdateClick" class="page-main__list")
    transition
      MessageBox(v-show="msgBoxIsShown && editFailed" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="closeMsgBox"
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
  get editFailed() { return this.requestStatus === 'failEdit' }

  // LIST click handler
  onEditClick(payload?: EditPayload) {
    if (payload) this.editPayload = payload // stored here in case of repeated request

    this.editList(this.editPayload)
      .then(() => {
        this.editPayload = null
        this.$emit('updateList')
      })
      .catch(() => {
        this.requestStatus = 'failEdit'
        this.openMsgBox()
      })
  }
  onUpdateClick() {
    this.$emit('updateList')
  }
  // MSGBOX click handler
  onFirstBtnClick() {
    this.closeMsgBox()

    switch (this.requestStatus) {
      case 'failEdit':
        this.onEditClick()
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
