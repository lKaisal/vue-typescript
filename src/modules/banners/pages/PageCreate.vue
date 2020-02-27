<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-create.page
    +e.container.js-voa.js-voa-start(v-click-outside="onClickOutside")
      +e.row-back(@click="goToPageMain")
        i(class="el-icon-back page-create__icon-back")
        +e.text-back Вернуться к списку
      +e.form-wrapper
        +e.H1.title.page-title Создание баннера
        FormBanners(class="page-create__form")
        +e.btns
          ButtonApp(btnType="primary" :isDisabled="!isSmthToCommit" @clicked="onSubmit" text="Сохранить баннер" class="page-create__btn")
          ButtonApp(btnType="warning" :isDisabled="!isSmthToCommit" :isPlain="true" @clicked="clearForm" text="Очистить форму" class="page-create__btn")
          ButtonApp(btnType="danger" :isPlain="true" @clicked="goToPageMain" text="Отменить" class="page-create__btn")
    transition-group(tag="div")
      MessageBox(v-show="msgBoxIsShown" key="msg" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClick" :secondBtn="secondBtn"
        class="page-create__msg-box modal modal-msg")
      PopupConflict(v-if="popupFormIsShown && bannerConflict" key="popup" :banner="bannerConflict" :dateStart="formActiveFrom.value"
        @confirm="onConflictConfirm" @discard="closePopupConflict" class="page-create__popup modal modal-conflict")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import vClickOuside from 'v-click-outside'
import ButtonApp from '@/components/ButtonApp.vue'
import MessageBox from '@/components/MessageBox.vue'
import { MsgBoxContent, Button } from '@/models'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import sleep from '@/mixins/sleep'
import { bannersMapper } from '../module/store'
import { Banner } from '../models'
import FormBanners from '../components/FormBanners.vue'
import PopupConflict from '../components/PopupConflict.vue'
import animateIfVisible from '../../../mixins/animateIfVisible'
import MsgBoxTools from '../mixins/MsgBoxTools'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['form', 'activeAmount', 'bannerCurrent']),
    ...bannersMapper.mapGetters(['listActive', 'formSort', 'formIsValid', 'formActiveFrom'])
  },
  methods: {
    ...bannersMapper.mapMutations(['setFormType', 'clearForm', 'setBannerCurrentSuccess', 'setValidationIsShown']),
    ...bannersMapper.mapActions(['createBanner', 'deactivateBanner', 'updateFormByBannerData'])
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

export default class PageCreate extends Mixins(MsgBoxTools, MsgBoxToolsApp, Mappers) {
  bannerId: number = null
  secondBtn: Button = null
  popupFormIsShown: boolean = false

  get bannerConflict() { return this.listActive.find(b => b.position === this.formSort.value) }
  get bannerConflictId() { return this.bannerConflict && this.bannerConflict.id }
  get isPageCreate() { return this.$route.path.includes('/banners/create') }
  get isSmthToCommit() {
    try {
      // check if any field was changed
      const form = this.form.data

      for (const field of form) {
        switch (field.name) {
          case 'isActive':
            break
          case 'file':
            if (field.value) return true
            break
          case 'pageType':
            if (field.value > 0) return true
            break
          case 'sort':
            if (field.value.toString() !== this.activeAmount.value.toString()) return true
            break
          default:
            if (!!field.value) return true
            break
        }
      }
    } catch {}
  }

  // HOOKS
  created() {
    this.setFormType('create')
    document.addEventListener('keydown', this.keydownHandler)
    if (this.bannerCurrent.data) this.updateFormByBannerData(this.bannerCurrent.data) // if free banner-cell was clicked on list, its position was stored
  }
  async mounted() {
    await this.$nextTick()
    animateIfVisible()
  }
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydownHandler)
    this.clearForm()
    this.setBannerCurrentSuccess(null)
  }

  // METHODS POPUP CONFLICT
  openPopupConflict() {
    document.body.classList.add('modal-open')
    this.popupFormIsShown = true
  }
  closePopupConflict() {
    document.body.classList.remove('modal-open')
    this.popupFormIsShown = false
    // this.bannerConflictId = null
  }
  // CLICK HANDLERS
  onSubmit() {
    if (this.formActiveFrom.value && this.bannerConflictId) {
      if (!this.formIsValid) this.setValidationIsShown(true)
      else this.openPopupConflict()
    } else this.submitForm()
  }
  onFirstBtnClick() {
    this.closeMsgBox()
    switch (this.requestStatus) {
      case 'failFetchList':
        this.$emit('updateList')
        break
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
  // OTHER HANDLERS
  keydownHandler(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      if (!this.msgBoxIsShown && !this.popupFormIsShown) this.goToPageMain()
      else if (this.popupFormIsShown) this.closePopupConflict()
      else if (this.msgBoxIsShown) this.closeMsgBox()
    }
  }
  onClickOutside(evt) {
    const targetIsPage = evt.srcElement.classList.contains('page-create')
    if (targetIsPage) this.goToPageMain()
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
