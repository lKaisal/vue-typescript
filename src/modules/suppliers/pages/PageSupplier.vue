<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-supplier.page
    +e.container(v-if="currentSupplier" v-click-outside="onClickOutside")
      RowBack(text="Вернуться к списку" @clicked="goToPageMain" class="page-supplier__row-back")
      CardSupplier(:supplier="currentSupplier" :timer="timerValue" @showPhoneManage="showPhoneManage" @resetSmsCount="initSmsCountReset"
        @updateIdentity="getIdentityData" @deleteIdentity="initDeleteIdentity"
        class="page-supplier__info-wrapper")
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
import { Supplier, EditPayload, SmsFields } from '../models'
import CardSupplier from '../components/CardSupplier.vue'
import PhoneManage from '../components/PhoneManage.vue'
import animateIfVisible from '../../../mixins/animateIfVisible'
import MsgBoxTools from '../mixins/MsgBoxTools'
import RowBack from '@/components/RowBack.vue'

const SuppliersMappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapState(['identity', 'smsReset']),
    ...suppliersMapper.mapGetters(['supplierByUserId'])
  },
  methods: {
    ...suppliersMapper.mapMutations(['clearIdentity']),
    ...suppliersMapper.mapActions(['getIdentity', 'editPhone', 'resetSmsCount', 'deletePhoneAuth'])
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
    RowBack
  }
})

export default class PageSupplier extends Mixins(MsgBoxTools, MsgBoxToolsApp, SuppliersMappers) {
  bannerId: number = null
  newPhone: Supplier['phone'] = null // for repeated request
  phoneManageIsShown: boolean = false
  secondBtn: Button = null
  timerValue: number = 0
  identityTimerRunning: boolean = false

  get failedFetchList() { return this.requestStatus === 'failFetchList' }
  get currentUserId() { return this.$route.params.userId }
  get currentSupplier() { return this.currentUserId && this.supplierByUserId(Number(this.currentUserId)) }

  // HOOKS
  created() {
    this.getIdentityData()
    document.addEventListener('keydown', this.keydownHandler)
  }
  async mounted() {
    await this.$nextTick()
    animateIfVisible()
  }
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydownHandler)
    this.destroyIdentityTimer()
    this.clearIdentity()
  }

  goToPageMain() { this.$router.push({ name: 'PageSuppliers' }).catch(err => {}) }
  // IDENTITY DATA METHODS
  getIdentityData() {
    this.destroyIdentityTimer()
    this.getIdentity(Number(this.currentUserId))
      .then(() => {
        this.timerValue = this.identity.data.lastCodeExpired
        this.initIdentityTimer()
      })
      .catch(() => {
        this.requestStatus = 'failFetchIdentity'
        this.secondBtn = { type: 'danger', isPlain: true }
        this.openMsgBox()
        return
      })
  }
  initDeleteIdentity() {
    this.requestStatus = 'beforeDeleteIdentity'
    this.secondBtn = { type: 'danger', isPlain: true }
    this.openMsgBox()
  }
  deleteIdentity() {
    this.destroyIdentityTimer()
    this.deletePhoneAuth(Number(this.currentUserId))
      .then(async () => {
        this.requestStatus = 'successDeleteIdentity'
        this.openMsgBox()
        await sleep(3000)
        this.closeMsgBox()
        this.goToPageMain()
      })
      .catch(() => {
        this.requestStatus = 'failDeleteIdentity'
        this.secondBtn = { type: 'danger', isPlain: true }
        this.openMsgBox()
        return
      })
  }
  // SMS RESET METHODS
  initSmsCountReset(field: keyof SmsFields) {
    this.destroyIdentityTimer()
    this.resetSmsCount({userId: Number(this.currentUserId), field})
      .then(async () => {
        this.initIdentityTimer()
        // @ts-ignore
        this.requestStatus = 'successReset' + field.charAt(0).toUpperCase() + field.slice(1)
        this.secondBtn = null
        this.openMsgBox()
        await sleep(3000)
        this.closeMsgBox()
        return
      })
      .catch(() => {
        // @ts-ignore
        this.requestStatus = 'failReset' + field.charAt(0).toUpperCase() + field.slice(1)
        this.secondBtn = { type: 'danger', isPlain: true }
        this.openMsgBox()
        return
      })
  }
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
      .then(async () => {
        this.newPhone = null
        this.requestStatus = 'successEdit'
        this.secondBtn = { type: 'success', isPlain: true }
        this.phoneManageIsShown = false
        this.openMsgBox()
        await sleep(3000)
        this.closeMsgBox()
      })
      .catch(() => {
        this.requestStatus = 'failEdit'
        this.secondBtn = { type: 'danger', isPlain: true }
        this.openMsgBox()
      })
  }
  // IDENTITY TIMER METHODS
  initIdentityTimer() {
    this.identityTimerRunning = true
    let startTime = (new Date()).getTime()
    const timerValue = () => {
      if (!this.identityTimerRunning) return

      if (this.timerValue === 0) {
        this.destroyIdentityTimer()
        return
      }

      const currentTime = (new Date()).getTime()
      const timePassed = currentTime - startTime
      if (timePassed >= 1000) {
        startTime = (new Date()).getTime()
        this.timerValue = Math.max(Math.round(this.timerValue - timePassed / 1000), 0)
        requestAnimationFrame(timerValue)
        return
      } else {
        requestAnimationFrame(timerValue)
        return
      }
    }

    requestAnimationFrame(timerValue)
  }
  destroyIdentityTimer() {
    this.identityTimerRunning = false
  }
  // CLICK HANDLERS
  onFirstBtnClick() {
    this.closeMsgBox()
    switch (this.requestStatus) {
      case 'failEdit':
        this.onEditPhone()
        break;
      case 'failFetchIdentity':
        this.getIdentityData()
        break
      case 'failResetSmsTryCount':
        this.initSmsCountReset(this.smsReset.field)
        break
      case 'successDeleteIdentity':
        this.goToPageMain()
        break
      case 'failDeleteIdentity':
      case 'beforeDeleteIdentity':
        this.deleteIdentity()
        break
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
    width-between-property 'top' 600 -30 1000 -20 true false
    width-between-property 'top' 1000 -20 1440 -40 false false
    width-between-property 'top' 1441 -40 1920 -50 false true
    +gt-md()
      position absolute
      left 0
    +lt-md()
      margin-bottom 25px

  &__info-wrapper
    padding-top 50px
    padding-bottom 50px
    width 100%
    +gt-sm()
      width-between-property 'padding-right' 601 25 1000 50 true true
      width-between-property 'padding-left' 601 25 1000 50 true true
      border-radius 6px
      border 2px solid $cBrand
      box-shadow 0 1rem 3rem rgba(0,0,0,.175)!important
    +xs()
      position relative
      left 50%
      transform translateX(-50%)
      width 100vw
      padding-top 25px
      padding-bottom 25px
      width-between-property 'padding-right' 375 25 600 50 true true
      width-between-property 'padding-left' 375 25 600 50 true true
    &.v-enter
      jsVoaStart()
</style>
