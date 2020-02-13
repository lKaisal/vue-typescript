<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page
    +e.container
      +e.title.H1.page-title Список баннеров
      ButtonApp(text="Создать баннер" @clicked="onCreateClick" icon="el-icon-plus" class="page-main__btn")
      ToggleAmount(@editClicked="openPopupAmount" class="page-main__amount")
      ListBanners(:key="list.isLoading" @deleteItem="onDeleteClick" class="page-main__list")
    transition-group(tag="div")
      MessageBox(v-show="msgBoxIsShown && !isLoading" key="msgBox" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClicked" :secondBtn="secondBtn" class="page-main__msg-box modal modal-msg")
      PopupAmount(v-show="popupAmountIsShown" key="popupAmount" @confirm="updateAmount" @cancel="closePopupAmount" class="page-main__popup-amount modal")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { MsgBoxContent, Button } from '../models'
import { bannersMapper } from '../module/store'
import sleep from '@/mixins/sleep'
import ButtonApp from '@/components/ButtonApp.vue'
import msgBoxTools from '../mixins/msgBoxTools'
import ListBanners from '../components/ListBanners.vue'
import MessageBox from '../components/MessageBox.vue'
import ToggleAmount from '../components/ToggleAmount.vue'
import PopupAmount from '../components/PopupAmount.vue'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['list']),
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
    msgBoxTools
  ]
})

export default class PageMain extends Mixins(msgBoxTools, Mappers) {
  deleteId: number = null
  secondBtn: Button = null
  popupAmountIsShown: boolean = false
  amountForUpdate: number = null

  created() {
    this.updateList()
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
    switch (this.requestStatus) {
      case 'beforeDelete':
        this.closeMsgBox()
        this.deleteItem()
        break
      case 'failFetchList':
        this.updateList()
        break
      case 'failSetAmount':
        this.updateAmount(this.amountForUpdate)
      default:
        this.closeMsgBox()
    }
  }
  onSecondBtnClicked() {
    switch (this.requestStatus) {
      case 'failSetAmount':
        this.closePopupAmount()
      default:
        this.closeMsgBox()
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
        await sleep(1500)
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
    this.amountForUpdate = amount // HACK: stored here in case of repeated request
    this.updateActiveAmount(amount)
      .then(() => {
          this.closePopupAmount()
          this.closeMsgBox()
          this.updateList()
        })
        .catch(() => {
        this.requestStatus = 'failSetAmount'
        this.secondBtn = { type: 'danger', isPlain: true }
        this.openMsgBox()
      })
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
