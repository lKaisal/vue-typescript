<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-create.page
    +e.container
      +e.row-back(@click="goToPageMain")
        i(class="el-icon-back page-create__icon-back")
        +e.text-back Вернуться к списку
      +e.form-wrapper
        +e.H1.title.page-title Создание баннера
        FormBanners(class="page-create__form")
        +e.btns
          ButtonApp(btnType="primary" :disabled="!isSmthToCommit" @clicked="onSubmit" text="Сохранить баннер" class="page-create__btn")
          ButtonApp(btnType="warning" :disabled="!isSmthToCommit" :isPlain="true" @clicked="clearForm" text="Очистить форму" class="page-create__btn")
          ButtonApp(btnType="danger" :isPlain="true" @clicked="goToPageMain" text="Отменить" class="page-create__btn")
    transition-group(tag="div")
      MessageBox(v-show="msgBoxIsShown" key="msg" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClick" :secondBtn="secondBtn"
        class="page-create__msg-box modal modal-msg")
      PopupConflict(v-if="popupFormIsShown && bannerConflict" key="popup" :banner="bannerConflict" :dateStart="!isActivatedToday && formActiveFrom.value"
        @confirm="onConflictConfirm" @discard="closePopupConflict" class="page-create__popup modal")
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { MsgBoxContent, Banner, Button } from '../models'
import MsgBoxTools from '../mixins/msgBoxTools'
import FormBanners from '../components/FormBanners.vue'
import MessageBox from '../components/MessageBox.vue'
import PopupConflict from '../components/PopupConflict.vue'
import sleep from '@/mixins/sleep'
import { bannersMapper } from '../module/store'
import ButtonApp from '@/components/ButtonApp.vue'
import vClickOuside from 'v-click-outside'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['form', 'activeAmount', 'bannerCurrent']),
    ...bannersMapper.mapGetters(['listActive', 'formSort', 'bannerById', 'formIsValid', 'isLoading', 'formActiveFrom'])
  },
  methods: {
    ...bannersMapper.mapMutations(['setFormType', 'clearForm', 'setBannerCurrent', 'setValidationIsShown']),
    ...bannersMapper.mapActions(['getList', 'deleteBanner', 'createBanner', 'deactivateBanner', 'updateFormByBannerData'])
  }
})

@Component({
  directives: {
    clickOutside: vClickOuside.directive
  },
  components: {
    FormBanners,
    MessageBox,
    PopupConflict,
    ButtonApp
  }
})

export default class PageCreate extends Mixins(MsgBoxTools, Mappers) {
  bannerId: number = null
  secondBtn: Button = null
  // bannerConflictId: number = null
  popupFormIsShown: boolean = false

  get bannerConflictId() { return this.listActive.find(b => b.position === this.formSort.value).id }
  get bannerConflict() { return this.bannerById(this.bannerConflictId) }
  get isPageCreate() { return this.$route.path.includes('/banners/create') }
  get isSmthToCommit() {
    try {
      // check if any field was changed
      const form = this.form.data
      const isActiveToCommit = !form.find(f => f.name === 'isActive').value
      const pageTypeToCommit = form.find(f => f.name === 'pageType').value > 0
      const sortToCommit = form.find(f => f.name === 'sort').value.toString() !== this.activeAmount.toString()
      const smthElseToCommit = form.filter(f => f.name !== 'isActive' && f.name !== 'sort' && f.name !== 'pageType').map(f => f.value).some(f => !!f)

      return smthElseToCommit
    } catch {}
  }
  // @ts-ignore
  get activeFrom() { return new Date(new Date(this.formActiveFrom.value).getFullYear(), new Date(this.formActiveFrom.value).getMonth() , new Date(this.formActiveFrom.value).getDate()) }
  get activeFromTime() { return this.activeFrom && new Date(this.activeFrom).getTime() }
  get today() { return new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate()) }
  get todayTime() { return this.today.getTime() }
  get isActivatedToday() { return this.activeFromTime === this.todayTime }

  created() {
    this.setFormType('create')
    document.addEventListener('keydown', this.keydownHandler)
    if (this.bannerCurrent.data) this.updateFormByBannerData(this.bannerCurrent.data)
  }
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydownHandler)
    this.clearForm()
    this.setBannerCurrent(null)
  }

  openPopupConflict() {
    document.body.classList.add('modal-open')
    this.popupFormIsShown = true
  }
  closePopupConflict() {
    document.body.classList.remove('modal-open')
    this.popupFormIsShown = false
    // this.bannerConflictId = null
  }
  keydownHandler(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      if (!this.msgBoxIsShown && !this.popupFormIsShown) this.goToPageMain()
      else if (this.popupFormIsShown) this.closePopupConflict()
      else if (this.msgBoxIsShown) this.closeMsgBox()
    }
  }
  onClickOutside() {
    this.goToPageMain()
  }
  // CLICK HANDLERS
  onSubmit() {
    if (this.formActiveFrom.value && this.bannerConflictId && !this.isActivatedToday) {
      if (!this.formIsValid) this.setValidationIsShown(true)
      else this.openPopupConflict()
    } else this.submitForm()
  }
  onFirstBtnClick() {
    switch (this.requestStatus) {
      case 'successCreate':
        this.goToPageEdit()
        break
      case 'failDeactivate':
        this.deactivateBannerConflict()
        break
      default:
        this.submitForm()
        break
    }
  }
  onSecondBtnClick() {
    switch (this.requestStatus) {
      case ('successCreate'):
        this.goToPageMain()
        break
      case 'failDeactivate':
        this.closeMsgBox()
        this.closePopupConflict()
        break
      default:
        this.closeMsgBox()
        break
    }
  }
  onConflictConfirm() {
    this.closePopupConflict()
    if (this.formActiveFrom.value) this.submitForm()
    else this.deactivateBannerConflict()
  }
  goToPageMain() { this.$router.push({ path: '/banners/list' }).catch(err => {}) }
  goToPageEdit() {
    if (!this.bannerCurrent.data) return

    this.$router.push({ path: `/banners/edit/${this.bannerCurrent.data.id}` }).catch(err => {})
  }
  // STORE ACTIONS CALL
  submitForm() {
    this.createBanner()
      .then(async () => {
        this.secondBtn = { type: 'success', isPlain: true }
        this.requestStatus = 'successCreate'
        this.openMsgBox()
        this.$emit('updateList')
        await sleep(1500)
        if (this.isPageCreate) {
          this.closeMsgBox()
          this.goToPageEdit()
        }
      })
      .catch(error => {
        if (this.formIsValid) {
          if (error.bannerId) {
            this.openPopupConflict()
          } else {
            this.secondBtn = { type: 'danger', isPlain: true }
            this.requestStatus = 'failCreate'
            this.openMsgBox()
          }
        }
      })
  }
  deactivateBannerConflict() {
    this.deactivateBanner(this.bannerConflictId)
      .then(() => {
        this.closeMsgBox()
        this.submitForm()
      })
      .catch(() => {
        this.requestStatus = 'failDeactivate'
        this.secondBtn = { type: 'danger', isPlain: true }
        this.openMsgBox()
      })
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-create

  &__container
    position relative
    display flex
    width 100%
    grid-size(4, 4, 5.5, 6, 8)
    margin-right auto
    margin-left auto
    align-self center
    +lt-md()
      flex-direction column

  &__row-back
    display flex
    flex-wrap nowrap
    padding 10px
    margin -10px
    cursor pointer
    fontMedium()
    transition()
    &:hover
      opacity .75
    +gt-md()
      position absolute
      top -50px
      left 0
    +lt-md()
      margin-bottom 25px

  &__icon-back
    transition(transform)
    .page-create__row-back:hover &
      transform translateX(-5px)

  &__text-back
    margin-left 10px
    white-space nowrap

  &__form-wrapper
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

  &__btns
    position relative
    margin-top 60px
    display flex
    align-items flex-end
    flex-wrap wrap
    +xl()
      margin-top 100px

  &__btn
    margin-bottom 10px
    &:not(:last-child)
      margin-right 10px
</style>
