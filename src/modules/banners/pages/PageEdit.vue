<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-edit.page
    transition(appear)
      +e.container.js-voa(v-if="banner && formAdditionalDataLoaded" v-click-outside="onClickOutside")
        +e.row-back(key="rowBack" @click="goToPageMain")
          i(class="el-icon-back page-edit__icon-back")
          +e.text-back Вернуться к списку
        +e.form-wrapper(key="form")
          +e.H1.title.page-title Редактирование баннера
          FormBanners(class="page-edit__form")
          +e.btns
            ButtonApp(btnType="primary" :isDisabled="!isSmthToUpdate" @clicked="onSubmit" text="Сохранить баннер" class="page-edit__btn")
            ButtonApp(btnType="warning" :isDisabled="!isSmthToUpdate" :isPlain="true" @clicked="resetForm" text="Сбросить изменения" class="page-edit__btn")
            ButtonApp(v-if="banner.isActive || banner.delayStart" btnType="danger" :isPlain="true" @clicked="onClickDelete" text="Отправить в архив" class="page-edit__btn")
            ButtonApp(:btnType="banner.isActive || banner.delayStart ? 'success' : 'danger'" :isPlain="true" @clicked="goToPageMain" text="Отмена" class="page-edit__btn")
    transition-group(tag="div")
      MessageBox(v-show="msgBoxIsShown" key="msg" :content="msgBoxContent" @close="onCloseClick" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClick" :secondBtn="secondBtn"
        class="page-edit__msg-box modal modal-msg")
      PopupConflict(v-if="popupFormIsShown && bannerConflict" key="popup" :banner="bannerConflict" :dateStart="!isActiveBanner && formActiveFrom.value"
        @confirm="onConflictConfirm" @discard="closePopupConflict" class="page-edit__popup modal modal-popup")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import sleep from '@/mixins/sleep'
import ButtonApp from '@/components/ButtonApp.vue'
import MessageBox from '@/components/MessageBox.vue'
import { Banner, RequestStatus } from '../models'
import { MsgBoxContent, Button } from '@/models'
import { bannersMapper } from '../module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import FormBanners from '../components/FormBanners.vue'
import PopupConflict from '../components/PopupConflict.vue'
import vClickOutside from 'v-click-outside'
import animateIfVisible from '@/mixins/animateIfVisible'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['form', 'bannerCurrent', 'pageTypes', 'list']),
    ...bannersMapper.mapGetters(['bannerById', 'formIsValid', 'listActive', 'formSort', 'formActiveFrom', 'formIsActive', 'bannerCurrentStatus', 'formAdditionalDataLoaded'])
  },
  methods: {
    ...bannersMapper.mapMutations(['setFormType', 'clearForm', 'setBannerCurrentSuccess', 'setValidationIsShown']),
    ...bannersMapper.mapActions(['editBanner', 'deleteBanner', 'updateFormByBannerData', 'getBannerById', 'deactivateBanner', 'loadAdditionalFormData'])
  }
})

@Component({
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    FormBanners,
    MessageBox,
    PopupConflict,
    ButtonApp,
  }
})

export default class PageEdit extends Mixins(MsgBoxTools, MsgBoxToolsApp, Mappers) {
  secondBtn: Button = null
  popupFormIsShown: boolean = false

  get failedFetchList() { return this.requestStatus === 'failFetchList' }
  get banner() { return this.bannerCurrent.data }
  get bannerConflict() { return (this.formIsActive.value || this.formActiveFrom.value) && this.listActive.find(b => b.position === this.formSort.value && b.id !== this.banner.id) }
  get bannerConflictId() { return this.bannerConflict && this.bannerConflict.id }
  get isSmthToUpdate() {
    if (!this.banner) return

    const form = this.form.data
    const banner = this.banner

    for (const field of form) {
      switch (field.name) {
        case 'file':
          // @ts-ignore
          if (!field.value || !!field.value.type) return true
          break
        case 'pageType':
          if (banner[field.name] !== field.value) return true
          break
        case 'sort':
          if ((this.formIsActive.value || this.formActiveFrom.value) && Math.abs(banner.position) !== field.value) return true
          break
        default:
          if ((banner[field.name] && banner[field.name].toString()) !== (field.value && field.value.toString())) return true
      }
    }
  }
  get isActiveBanner() { return this.bannerCurrentStatus && this.bannerCurrentStatus === 'active' }
  get isDelayedBanner() { return this.bannerCurrentStatus && this.bannerCurrentStatus === 'delayed' }
  get moduleLink() { return this.$route && this.$route.matched && this.$route.matched[0].path.slice(1) }

  @Watch('banner', { immediate: true })
  async onBannerChange(val) {
    if (val) {
      await this.$nextTick()
      animateIfVisible()
    }
  }
  @Watch('list', { deep: true, immediate: true })
  onListChange(val) {
    console.log('list changed ' + val)
    this.updateBannerData()
  }

  // HOOKS
  async created() {
    this.setFormType('edit')
    if (!this.formAdditionalDataLoaded) await this.loadAdditionalData()
    this.updateBannerData()
    document.addEventListener('keydown', this.keydownHandler)
  }
  async mounted() {
    await this.$nextTick()
    animateIfVisible()
  }
  beforeDestroy() {
    this.clearForm()
    document.removeEventListener('keydown', this.keydownHandler)
    this.$emit('updateList')
    this.setBannerCurrentSuccess(null)
  }

  // METHODS
  loadAdditionalData() {
    return new Promise((resolve, reject) => {
      if (this.msgBoxIsShown) this.closeMsgBox()

      this.loadAdditionalFormData()
        .then(() => {
          resolve()
        })
        .catch((err) => {
          if (err && err.status && err.status.toString().slice(0, 2) == 40) this.$emit('goToPageAuth')
          else {
            this.requestStatus = 'failLoadAdditionalFormData'
            this.secondBtn = { type: 'success', isPlain: true }
            this.openMsgBox()
          }
          reject()
        })
    })
  }
  keydownHandler(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      // if (!this.msgBoxIsShown && !this.popupFormIsShown) this.goToPageMain()
      if (this.popupFormIsShown) this.closePopupConflict()
      else if (this.msgBoxIsShown) this.closeMsgBox()
    }
  }
  onClickOutside(evt) {
    const targetIsPage = evt.srcElement.classList.contains('page-edit')
    if (targetIsPage) this.goToPageMain()
  }
  // CLICK HANDLERS
  onCloseClick() {
    switch (this.requestStatus) {
      case 'failFetchBanner':
        this.goToPageMain()
        break
      default:
        this.closeMsgBox()
        break
    }
  }
  onSubmit() {
    if (this.bannerConflictId && !this.isActiveBanner) {
      if (!this.formIsValid) this.setValidationIsShown(true)
      else this.openPopupConflict()
    } else this.submitForm()
  }
  onClickDelete() {
    this.secondBtn = { type: 'danger', isPlain: true }
    this.requestStatus = 'beforeDelete'
    this.openMsgBox()
  }
  deleteItem() {
    this.deleteBanner(this.banner.id)
      .then(async () => {
        this.requestStatus = 'successDelete'
        this.secondBtn = { type: 'success', isPlain: true }
        this.openMsgBox()
        await sleep(3000)
        this.goToPageMain()
        this.closeMsgBox()
      })
      .catch(() => {
        this.requestStatus = 'failDelete'
        this.secondBtn = { type: 'danger', isPlain: true }
        this.openMsgBox()
        this.$emit('updateList')
      })
  }
  onFirstBtnClick() {
    this.closeMsgBox()
    switch (this.requestStatus) {
      case 'successEdit':
        break
      case 'failEdit':
        this.submitForm()
        break
      case 'failDelete':
        this.onClickDelete()
        break
      case 'failDeactivate':
        this.deactivateBannerConflict()
        break
      case 'beforeDelete':
        this.deleteItem()
        break
      case 'failFetchBanner':
      case 'successDelete':
      default:
        this.goToPageMain()
        break
    }
  }
  onSecondBtnClick() {
    this.closeMsgBox()
    switch (this.requestStatus) {
      case 'successCreate':
      case 'successEdit':
        this.goToPageMain()
        break
    }
  }
  onConflictConfirm() {
    this.closePopupConflict()
    if (this.formActiveFrom.value && !this.isActiveBanner) this.submitForm()
    else this.deactivateBannerConflict()
  }
  goToPageMain() { this.$router.push({ path: `/${this.moduleLink}/list`, hash: `#${this.bannerCurrentStatus}` }).catch(err => {}) }
  // STORE ACTIONS CALL
  updateBannerData() {
    const id = Number(this.$route.params.id)
    let banner = this.bannerById(id) || this.banner

    if (!banner) {
      this.getBannerById(id)
        .catch(() => {
          this.requestStatus = 'failFetchBanner'
          this.secondBtn = { type: 'danger', isPlain: true }
          this.openMsgBox()
          this.$emit('updateData')
          return
        })
    } else {
      this.setBannerCurrentSuccess(banner)
      this.updateFormByBannerData(banner)
    }
  }
  submitForm() {
    this.editBanner(this.banner.id)
      .then(async () => {
        this.requestStatus = 'successEdit'
        this.secondBtn = { type: 'success', isPlain: true }
        this.openMsgBox()
        await sleep(3000)
        this.closeMsgBox()
      })
      .catch(error => {
        if (this.formIsValid) {
          if (error.bannerId) {
            // this.bannerConflictId = error.bannerId
            this.openPopupConflict()
          } else {
            this.requestStatus = 'failEdit'
            this.secondBtn = { type: 'danger', isPlain: true }
            this.openMsgBox()
          }
        }
      })
  }
  async resetForm() {
    this.clearForm()

    if (this.banner) this.updateFormByBannerData(this.banner)
  }
  deactivateBannerConflict() {
    this.deactivateBanner(this.bannerConflictId)
      .then(() => {
        this.submitForm()
      })
      .catch(() => {
        this.requestStatus = 'failDeactivate'
        this.secondBtn = { type: 'danger', isPlain: true }
        this.openMsgBox()
        this.$emit('updateList')
      })
  }
  // POPUP-BANNER TOGGLE METHODS
  openPopupConflict() {
    document.body.classList.add('modal-open')
    this.popupFormIsShown = true
  }
  closePopupConflict() {
    document.body.classList.remove('modal-open')
    this.popupFormIsShown = false
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-edit

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
      // top -50px
      left 0
    +lt-md()
      margin-bottom 25px
    &.v-enter
      jsVoaStart()

  &__icon-back
    transition(transform)
    .page-edit__row-back:hover &
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
    &.v-enter
      jsVoaStart()

  &__btns
    position relative
    margin-top 40px
    display flex
    align-items flex-end
    flex-wrap wrap
    +xl()
      margin-top 100px

  &__btn
    margin-bottom 10px
    &:not(:last-child)
      margin-right 10px

  &__popup
    +lt-lg()
      display block
</style>
