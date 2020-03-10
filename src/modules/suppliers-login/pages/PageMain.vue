<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page
    +e.container.js-voa.js-voa-start(v-if="list.data && list.data.length")
      SearchApp(:list="listSorted" :fields="searchFields" @searchProgress="handleSearchProgress" @searchFinished="handleSearchFinished" class="page-main__search")
      transition(mode="out-in")
        ListSuppliers(:list="currentList" :key="listSorted.length + pageSize + currentPage" @itemClicked="onItemClick" class="page-main__list")
      PaginationApp(:total="listSorted && listSorted.length" :pageSize="pageSize" @currentChange="onCurrentChange" @pageSizeChange="onPageSizeChange" class="page-main__pag")
    transition-group(tag="div")
      MessageBox(v-show="msgBoxIsShown && !fetchListFailed" key="msg" :content="msgBoxContent" :secondBtn="secondBtn" @close="closeMsgBox"
        @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClick" class="list-features__msg-box modal modal-msg")
      PopupSupplier(v-if="popupIsShown" :key="breakpoint" :supplier="popupSupplier" :phoneManageIsShown="phoneManageIsShown" key="popup" @editPhone="onEditPhone" @discard="onPopupDiscard"
        @showPhoneManage="phoneManageIsShown=true" @hidePhoneManage="phoneManageIsShown=false" class="page-main__popup modal modal-popup")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { MsgBoxContent, Button, SearchField } from '@/models'
import { suppliersMapper } from '../module/store'
import sleep from '@/mixins/sleep'
import ButtonApp from '@/components/ButtonApp.vue'
import MessageBox from '@/components/MessageBox.vue'
import PaginationApp from '@/components/PaginationApp.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import animateIfVisible from '@/mixins/animateIfVisible'
import { EditPayload, Supplier } from '../models'
import ListSuppliers from '../components/ListSuppliers.vue'
import PopupSupplier from '../components/PopupSupplier.vue'
import { mapState } from 'vuex'
import SearchApp from '@/components/SearchApp.vue'

const Mappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapState(['list', 'listFiltered']),
    ...suppliersMapper.mapGetters(['isLoading', 'listSorted'])
  },
  methods: {
    ...suppliersMapper.mapMutations(['setListFiltered']),
    ...suppliersMapper.mapActions(['editPhone'])
  }
})

@Component({
  components: {
    MessageBox,
    ButtonApp,
    ListSuppliers,
    PaginationApp,
    PopupSupplier,
    SearchApp
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
  newPhone: Supplier['phone'] = null // for repeated request
  pageSize: number = 15
  currentPage: number = 1
  popupId: number = null
  searchFields: SearchField[] = [
    { field: 'supplierId', title: 'SupplierId' },
    { field: 'supplierName', title: 'Имя поставщика' },
    { field: 'userId', title: 'UserId' },
    { field: 'userName', title: 'Имя пользователя' },
    { field: 'inn', title: 'ИНН' },
    { field: 'phone', title: 'Номер телефона' }
  ]
  phoneManageIsShown: boolean = false
  secondBtn: Button = null

  // list getters
  get fetchListFailed() { return this.requestStatus === 'failFetchList' }
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

  // SEARCH handlers
  handleSearchProgress(res) {
    this.setListFiltered(res)
  }
  handleSearchFinished() {
    this.setListFiltered(null)
  }
  // PAGINATION click handlers
  onCurrentChange(n) {
    this.currentPage = n
  }
  onPageSizeChange(n) {
    this.pageSize = n
  }
  // LIST click handlers
  onItemClick(id) {
    this.popupId = id
  }
  // POPUP click handlers
  onEditPhone(phone?: Supplier['phone']) {
    if (phone) this.newPhone = phone // stored here in case of repeated request

    const editPayload: EditPayload = {phoneAuthId: this.popupSupplier.phoneAuthId, phone: this.newPhone}
    this.editPhone(editPayload)
      .then(() => {
        this.newPhone = null
        this.requestStatus = 'successEdit'
        this.secondBtn = { type: 'success', isPlain: true }
        this.phoneManageIsShown = false
        this.openMsgBox()
      })
      .catch(() => {
        this.requestStatus = 'failEdit'
        this.secondBtn = { type: 'danger', isPlain: true }
        this.openMsgBox()
      })
  }
  onPopupDiscard() {
    this.popupId = null
    this.phoneManageIsShown = false
  }
  // MSGBOX click handler
  onFirstBtnClick() {
    this.closeMsgBox()

    switch (this.requestStatus) {
      case 'failEdit':
        this.onEditPhone()
        break
    }
  }
  onSecondBtnClick() {
    this.closeMsgBox()

    switch (this.requestStatus) {
      case 'successEdit':
        this.onPopupDiscard()
        break
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-main

  &__search
    +gt-md()
      margin-bottom 20px
    +lt-md()
      margin-bottom 30px

  &__list
    transition(opacity)
    &.v-enter
    &.v-leave-to
      opacity 0
</style>
