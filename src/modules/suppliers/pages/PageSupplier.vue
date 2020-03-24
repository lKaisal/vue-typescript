<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-supplier.page
    +e.container(v-if="currentSupplier && identity.data" v-click-outside="onClickOutside")
      +e.row-back(@click="goToPageMain")
        i(class="el-icon-back page-supplier__icon-back")
        +e.text-back Вернуться к списку
      CardSupplier(:supplier="currentSupplier" @showPhoneInput="showPhoneManage" class="page-supplier__info-wrapper")
    transition-group(tag="div")
      MessageBox(v-show="msgBoxIsShown" key="msg" :content="msgBoxContent" @close="closeMsgBox"
        @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClick" :secondBtn="secondBtn"
        class="page-supplier__msg-box modal modal-msg")
      PhoneManage(v-show="phoneManageIsShown" key="phone" :inputIsShown="phoneManageIsShown" :prevNumber="currentSupplier.phone"
          @confirm="onEditPhone" @discard="hidePhoneManage"
          class="page-supplier__phone-manage modal modal-phone")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import vClickOuside from 'v-click-outside'
import MessageBox from '@/components/MessageBox.vue'
import { MsgBoxContent, Button } from '@/models'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import sleep from '@/mixins/sleep'
import { suppliersMapper } from '../module/store'
import { Supplier, EditPayload } from '../models'
import CardSupplier from '../components/CardSupplier.vue'
import PhoneManage from '../components/PhoneManage.vue'
import animateIfVisible from '../../../mixins/animateIfVisible'
import MsgBoxTools from '../mixins/MsgBoxTools'

const SuppliersMappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapState(['identity']),
    ...suppliersMapper.mapGetters(['supplierByUserId'])
  },
  methods: {
    ...suppliersMapper.mapActions(['getIdentity', 'editPhone'])
  }
})

@Component({
  directives: {
    clickOutside: vClickOuside.directive
  },
  components: {
    CardSupplier,
    MessageBox,
    PhoneManage,
  }
})

export default class PageSupplier extends Mixins(MsgBoxTools, MsgBoxToolsApp, SuppliersMappers) {
  bannerId: number = null
  newPhone: Supplier['phone'] = null // for repeated request
  phoneManageIsShown: boolean = false
  secondBtn: Button = null

  get failedFetchList() { return this.requestStatus === 'failFetchList' }
  get currentUserId() { return this.$route.params.userId }
  get currentSupplier() { return this.currentUserId && this.supplierByUserId(Number(this.currentUserId)) }

  // HOOKS
  async created() {
    await this.getIdentity()
    document.addEventListener('keydown', this.keydownHandler)
  }
  async mounted() {
    await this.$nextTick()
    animateIfVisible()
  }
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydownHandler)
  }

  goToPageMain() { this.$router.push({ name: 'PageSuppliers' }).catch(err => {}) }
  // PHONE MANAGES METHODS
  showPhoneManage() {
    document.body.classList.add('modal-open')
    this.phoneManageIsShown = true
  }
  hidePhoneManage() {
    document.body.classList.remove('modal-open')
    this.phoneManageIsShown = false
  }
  onEditPhone(phone?: Supplier['phone']) {
    if (phone) this.newPhone = phone // stored here in case of repeated request

    const editPayload: EditPayload = {phoneAuthId: this.currentSupplier.phoneAuthId, phone: this.newPhone}
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
  // CLICK HANDLERS
  onFirstBtnClick() {
    this.closeMsgBox()
    switch (this.requestStatus) {
      case 'failEdit':
        this.onEditPhone()
        break;
    }
  }
  onSecondBtnClick() {
    this.closeMsgBox()
    switch (this.requestStatus) {
      case 'successEdit':
        this.goToPageMain()
        break
    }
  }
  // OTHER HANDLERS
  keydownHandler(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      if (this.msgBoxIsShown) this.closeMsgBox()
    }
  }
  onClickOutside(evt) {
    const targetIsPage = evt.srcElement.classList.contains('page-supplier')
    if (targetIsPage) this.goToPageMain()
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-supplier

  &__container
    grid-size(4, 4, 5.5, 6, 8)
    position relative
    display flex
    flex-direction column
    width 100%
    margin-right auto
    margin-left auto
    align-self center
    +lt-md()
      flex-direction column
    &.v-enter
      jsVoaStart()

  &__row-back
    display flex
    flex-wrap nowrap
    padding 10px
    margin -10px
    width-between-property 'top' 600 -30 1000 -20 true false
    width-between-property 'top' 1000 -20 1440 -40 false false
    width-between-property 'top' 1441 -40 1920 -50 false true
    cursor pointer
    fontMedium()
    &:hover
      opacity .75
    +gt-md()
      position absolute
      left 0
    +lt-md()
      margin-bottom 25px
    &.v-enter
      jsVoaStart()

  &__icon-back
    transition(transform)
    .page-supplier__row-back:hover &
      transform translateX(-5px)

  &__text-back
    margin-left 10px
    white-space nowrap

  &__info-wrapper
    padding 50px
    width 100%
    +gt-sm()
      border-radius 6px
      border 2px solid $cBrand
      box-shadow 0 1rem 3rem rgba(0,0,0,.175)!important
    +xs()
      position relative
      left 50%
      transform translateX(-50%)
      width 100vw
      padding 25px
    &.v-enter
      jsVoaStart()
</style>
