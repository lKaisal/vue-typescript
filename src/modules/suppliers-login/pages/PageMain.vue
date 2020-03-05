<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page
    +e.container.js-voa.js-voa-start(v-if="!isLoading && list.data && list.data.length")
      ListSuppliers(:list="currentList" @itemClicked="onItemClick" class="page-main__list")
      PaginationApp(:total="listSorted && listSorted.length" :pageSize="pageSize" @currentChange="onCurrentChange" @pageSizeChange="onPageSizeChange" class="page-main__pag")
    transition-group(tag="div")
      MessageBox(v-show="msgBoxIsShown && editFailed" key="msg" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="closeMsgBox"
        class="list-features__msg-box modal modal-msg")
      PopupSupplier(v-if="popupIsShown" :key="breakpoint" :supplier="popupSupplier" key="popup" @confirm="onPopupConfirm" @discard="onPopupDiscard" class="page-main__popup modal modal-popup")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { MsgBoxContent, Button } from '@/models'
import { suppliersMapper } from '../module/store'
import sleep from '@/mixins/sleep'
import ButtonApp from '@/components/ButtonApp.vue'
import MessageBox from '@/components/MessageBox.vue'
import PaginationApp from '@/components/PaginationApp.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import animateIfVisible from '@/mixins/animateIfVisible'
import { EditPayload } from '../models'
import ListSuppliers from '../components/ListSuppliers.vue'
import PopupSupplier from '../components/PopupSupplier.vue'
import { mapState } from 'vuex'

const Mappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapState(['list']),
    ...suppliersMapper.mapGetters(['isLoading', 'listSorted'])
  },
  methods: {
    ...suppliersMapper.mapActions(['editList'])
  }
})

@Component({
  components: {
    MessageBox,
    ButtonApp,
    ListSuppliers,
    PaginationApp,
    PopupSupplier
  },
  mixins: [
    MsgBoxTools
  ],
  computed: {
    ...mapState('system', [
      'breakpoint'
    ])
  }
})

export default class PageMain extends Mixins(MsgBoxTools, MsgBoxToolsApp, Mappers) {
  editPayload: EditPayload = null // for repeated request
  pageSize: number = 25
  currentPage: number = 1
  popupId: number = null

  // list getters
  get editFailed() { return this.requestStatus === 'failEdit' }
  get pagesAmount() { return this.listSorted && this.listSorted.length / this.pageSize }
  get listByPages() {
    if (!this.listSorted) return

    const arr = []
    for (let i = 0; i < this.pagesAmount; i ++) {
      const start = i * this.pageSize
      const end = start + this.pageSize
      const part = this.listSorted.slice(start, end)
      arr.push(part)
    }

    return arr
  }
  get currentList() { return this.listByPages && this.listByPages[this.currentPage - 1] }
  // popup getters
  get popupIsShown() { return typeof this.popupId === 'number' && this.popupSupplier }
  get popupSupplier() { return this.listSorted && this.listSorted.find(s => s.userId === this.popupId) }

  // PAGINATION click handler
  onCurrentChange(n) {
    this.currentPage = n
  }
  onPageSizeChange(n) {
    this.pageSize = n
  }
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
  onItemClick(id) {
    this.popupId = id
  }
  // POPUP click handler
  onPopupConfirm() {
    this.popupId = null
  }
  onPopupDiscard() {
    this.popupId = null
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
