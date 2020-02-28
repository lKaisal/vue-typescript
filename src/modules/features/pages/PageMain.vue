<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page
    +e.container(v-if="!isLoading")
      //- navigation (sort)
      +e.EL-MENU.sort(:default-active="(activeHashIndex + 1).toString()" mode="horizontal" @select="handleMenuClick")
        +e.EL-MENU-ITEM.sort-item(v-for="(item, index) in sortItems" :key="index" :index="(index + 1).toString()" v-html="item" :class="{ 'is-disabled': !tabs[index].list.length }")
      //- list
      transition(mode="out-in")
        ListFeatures(v-if="listCurrent && listCurrent.length" :key="activeHashIndex" :list="listCurrent" :isActive="activeHashIndex === 0" @editClicked="onEditClick" class="page-main__list")
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" :secondBtn="secondBtn" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="closeMsgBox"
        class="list-features__msg-box modal modal-msg")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { MsgBoxContent, Button } from '@/models'
import { featuresMapper } from '../module/store'
import sleep from '@/mixins/sleep'
import ButtonApp from '@/components/ButtonApp.vue'
import MessageBox from '@/components/MessageBox.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import ListFeatures from '../components/ListFeatures.vue'
import animateIfVisible from '@/mixins/animateIfVisible'
import { EditPayload } from '../models'

const Mappers = Vue.extend({
  computed: {
    ...featuresMapper.mapState(['listSort', 'hashes']),
    ...featuresMapper.mapGetters(['listActive', 'listInactive', 'isLoading'])
  },
  methods: {
    ...featuresMapper.mapMutations(['updateListSort']),
    ...featuresMapper.mapActions(['editList'])
  }
})

@Component({
  components: {
    MessageBox,
    ButtonApp,
    ListFeatures
  },
  mixins: [
    MsgBoxTools
  ]
})

export default class PageMain extends Mixins(MsgBoxTools, MsgBoxToolsApp, Mappers) {
  editPayload: EditPayload = null // for repeated request
  secondBtn: Button = null
  get tabs() {
    try {
      return [
        { hash: this.hashes[0], list: this.listActive, sort: `Активные (${this.listActive.length})` },
        { hash: this.hashes[1], list: this.listInactive, sort: `Неактивные (${this.listInactive.length})` },
      ]
    } catch {}
  }
  get activeHash() { return this.$route.hash }
  // @ts-ignore
  get activeHashIndex() { return this.activeHash && this.hashes.indexOf(this.activeHash.slice(1)) || 0 }
  get listCurrent() { return this.tabs && this.tabs[this.activeHashIndex].list }
  get sortItems() { return this.tabs && this.tabs.map(item => item.sort) }

  // NAVMENU click handler
  handleMenuClick(index) {
    this.$router.push({path: this.$route.path, hash: `#${this.hashes[index - 1]}` }).catch(err => {})
  }
  // LIST click handler
  onEditClick(payload?: EditPayload) {
    if (payload) this.editPayload = payload // stored here in case of repeated request

    this.requestStatus = 'beforeEdit'
    this.secondBtn = { type: 'danger', isPlain: true }
    this.msgBoxOtherMsgs['beforeEdit'] = this.beforeEditMsg[this.activeHashIndex]
    this.openMsgBox()
  }
  editConfirm() {
    this.editList(this.editPayload)
      .then(() => {
        if (!this.listCurrent.length) {
          const hashIndex = this.activeHashIndex === 0 ? 2 : 1
          this.handleMenuClick(hashIndex)
        }
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
