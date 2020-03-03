<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page
    +e.container
      +e.title.H1.page-title.js-voa.js-voa-start Список баннеров
      ButtonApp(text="Создать баннер" @clicked="onCreateClick" icon="el-icon-plus" class="page-main__btn js-voa js-voa-start")
      ToggleAmount(v-show="activeAmount.value" @editClicked="openPopupAmount" class="page-main__amount js-voa js-voa-start")
      ListBanners(v-if="list.data && list.data.length" :key="list.isLoading" @animateOneMore="animateOneMoreTime" @deleteItem="onDeleteClick" class="page-main__list js-voa js-voa-start")
    transition-group(tag="div")
      MessageBox(v-show="msgBoxIsShown" key="msgBox" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClicked" :secondBtn="secondBtn"
        class="page-main__msg-box modal modal-msg")
      PopupAmount(v-if="popupAmountIsShown" key="popupAmount" @confirm="updateAmount" @cancel="closePopupAmount" class="page-main__popup-amount modal")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { MsgBoxContent, Button } from '@/models'
import { bannersMapper } from '../module/store'
import sleep from '@/mixins/sleep'
import ButtonApp from '@/components/ButtonApp.vue'
import MessageBox from '@/components/MessageBox.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import ListBanners from '../components/ListBanners.vue'
import ToggleAmount from '../components/ToggleAmount.vue'
import PopupAmount from '../components/PopupAmount.vue'
import animateIfVisible from '@/mixins/animateIfVisible'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['list', 'activeAmount']),
    ...bannersMapper.mapGetters(['isLoading'])
  },
  methods: {
    ...bannersMapper.mapActions(['deleteBanner', 'updateActiveAmount'])
  }
})

@Component({
  components: {
    ListBanners,
    MessageBox,
    ButtonApp,
    ToggleAmount,
    PopupAmount
  },
  mixins: [
    MsgBoxTools
  ]
})

export default class PageMain extends Mixins(MsgBoxTools, MsgBoxToolsApp, Mappers) {
  deleteId: number = null
  secondBtn: Button = null
  popupAmountIsShown: boolean = false
  amountForUpdate: number = null

  get failedFetchList() { return this.requestStatus === 'failFetchList' }
  get activeAmountValue() { return this.activeAmount.value }

  @Watch('list', { immediate: true })
  async onListChange() {
    await this.$nextTick()
    await sleep(500)
    animateIfVisible()
  }
  @Watch('activeAmountValue', { immediate: true })
  async onActiveAmountChange() {
    await this.$nextTick()
    animateIfVisible()
  }
  @Watch('isLoading', { immediate: true })
  async onIsLoadingChange() {
    await this.$nextTick()
    animateIfVisible()
  }

  async mounted() {
    await this.$nextTick()
    animateIfVisible()
  }

  // CLICK HANDLERS
  onCreateClick() { this.$router.push({ path: '/banners/create' }) }
  onDeleteClick(id) {
    // store id here in case of repeated request
    if (id) this.deleteId = id

    this.secondBtn = { type: 'danger', isPlain: true }
    this.requestStatus = 'beforeDelete'
    this.openMsgBox()
  }
  onFirstBtnClick() {
    this.closeMsgBox()
    switch (this.requestStatus) {
      case 'beforeDelete':
        this.deleteItem()
        break
      case 'failSetAmount':
        this.updateAmount(this.amountForUpdate)
    }
  }
  onSecondBtnClicked() {
    this.closeMsgBox()
    switch (this.requestStatus) {
      case 'failSetAmount':
        this.closePopupAmount()
    }
  }
  async openPopupAmount() {
    this.popupAmountIsShown = true
    document.body.classList.add('modal-open')
  }
  closePopupAmount() {
    this.popupAmountIsShown = false
    document.body.classList.remove('modal-open')
  }
  // STORE ACTIONS CALL
  deleteItem() {
    this.deleteBanner(this.deleteId)
      .then(async() => {
        this.secondBtn = { type: 'success', isPlain: true }
        this.requestStatus = 'successDelete'
        this.openMsgBox()
        this.deleteId = null
        this.updateList()
        await sleep(3000)
        this.closeMsgBox()
      })
      .catch(() => {
        this.secondBtn = { type: 'danger', isPlain: true }
        this.requestStatus = 'failDelete'
        this.updateList()
        this.openMsgBox()
      })
  }
  updateList() {
    this.$emit('updateList')
  }
  updateAmount(amount) {
    if (amount === this.activeAmount.value) {
      this.closePopupAmount()
      this.closeMsgBox()
      return
    }

    // stored amount here in case of repeated request
    this.amountForUpdate = amount
    this.closePopupAmount()
    this.updateActiveAmount(amount)
      .then(() => {
          this.updateList()
        })
        .catch(() => {
          this.requestStatus = 'failSetAmount'
          this.secondBtn = { type: 'danger', isPlain: true }
          this.openMsgBox()
      })
  }
  async animateOneMoreTime() {
    await this.$nextTick()
    animateIfVisible()
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-main

  &__container
    position relative

  &__btn
    margin-bottom 50px

  &__amount
    margin-bottom 25px

  &__list
    width 100%
</style>
