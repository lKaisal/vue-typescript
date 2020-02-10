<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-edit.page(v-loading.fullscreen.lock="isLoading")
    +e.container
      +e.row-back(@click="goToPageMain")
        i(class="el-icon-back page-edit__icon-back")
        +e.text-back Вернуться к списку
      +e.form-wrapper
        +e.H1.title.page-title Редактирование баннера
        FormBanners(class="page-edit__form")
        +e.btns
          ButtonApp(class="page-edit__btn" btnType="primary" :disabled="!isSmthToUpdate" @clicked="submitForm" text="Сохранить баннер")
          ButtonApp(class="page-edit__btn" btnType="warning" :disabled="!isSmthToUpdate" :isPlain="true" @clicked="resetForm" text="Сбросить изменения")
          ButtonApp(class="page-edit__btn" btnType="danger" :isPlain="true" @clicked="onClickDelete" text="Удалить баннер")
          ButtonApp(class="page-edit__btn" btnType="success" :isPlain="true" @clicked="goToPageMain" text="Отмена")
      //- OtherBanners(:list="listOther" class="page-edit__other")
    transition-group(tag="div")
      MessageBox(v-show="msgBoxIsShown" key="msg" :content="msgBoxContent" @close="onCloseClick" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClick" :secondBtn="secondBtn"
        class="page-edit__msg-box modal modal-msg")
      PopupForm(v-if="popupFormIsShown && bannerConflict" key="popup" :banner="bannerConflict" @confirm="deactivateBannerConflict" @discard="closePopupForm" class="page-edit__popup modal modal-popup")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { MsgBoxContent, Banner, RequestStatus, Button } from '../models'
import MsgBoxTools from '../mixins/msgBoxTools'
import FormBanners from '../components/FormBanners.vue'
import MessageBox from '../components/MessageBox.vue'
import PopupForm from '../components/PopupForm.vue'
import sleep from '@/mixins/sleep'
import { bannersMapper } from '../module/store'
import ButtonApp from '@/components/ButtonApp.vue'
import OtherBanners from '../components/OtherBanners.vue'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['list', 'isLoading', 'form']),
    ...bannersMapper.mapGetters(['bannerById', 'formIsValid', 'listActive', 'formSort', 'listSorted'])
  },
  methods: {
    ...bannersMapper.mapMutations(['setFormType', 'clearForm', 'setIsLoading']),
    ...bannersMapper.mapActions(['editBanner', 'deleteBanner', 'updateFormByBannerData', 'getBannerById', 'getList', 'deactivateBanner'])
  }
})

@Component({
  components: {
    FormBanners,
    MessageBox,
    PopupForm,
    ButtonApp,
    OtherBanners
  }
})

export default class PageEdit extends Mixins(MsgBoxTools, Mappers) {
  banner: Banner = null
  secondBtn: Button = null
  bannerConflictId: number = null
  popupFormIsShown: boolean = false
  // isSmthToUpdate: boolean = false

  get bannerConflict() { return this.bannerById(this.bannerConflictId) }
  get isSmthToUpdate() {
    if (!this.banner) return false

    // check all fields equality except img
    const form = this.form.data
    const banner = this.banner

    for (const field of form) {
      switch (field.name) {
        case 'file':
          // @ts-ignore
          if (!field.value || !!field.value.type) return true
          break
        case 'sort':
          if (!form.find(f => f.name === 'isActive').value) break
          else return banner.sortCalculated !== field.value
        default:
          if ((banner[field.name] && banner[field.name].toString()) !== (field.value && field.value.toString())) return true
      }
    }

    return false
  }
  get listOther() {
    if (!this.banner) return

    if (this.banner.isActive) return this.listActive.filter(b => b.id !== this.banner.id)
    else {
      const shuffled = [...this.listSorted].sort(() => .5 - Math.random())
      return shuffled.slice(0, 4)
    }
  }

  @Watch('list', { immediate: true })
  onListChanged(val) {
    if (val) {
      const id = Number(this.$route.params.id)
      this.banner = this.bannerById(id)

      if (this.banner) this.updateFormByBannerData(this.banner)
      else {
        this.requestStatus = 'failFetchBanner'
        this.secondBtn = { type: 'danger', isPlain: true }
        this.openMsgBox()
      }
    }
  }

  created() {
    this.clearForm()
    this.setFormType('edit')
    // this.updateBannerData()
    const id = Number(this.$route.params.id)
    this.banner = this.bannerById(id)

    if (this.banner) this.updateFormByBannerData(this.banner)
    else this.setIsLoading(true)
  }

  beforeDestroy() {
    this.clearForm()
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
  onFirstBtnClick() {
    switch (this.requestStatus) {
      case 'successEdit':
        this.closeMsgBox()
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
      case 'failFetchBanner':
      case 'successDelete':
      default:
        this.goToPageMain()
        break
    }
  }
  onSecondBtnClick() {
    switch (this.requestStatus) {
      case 'failCreate':
      case 'failEdit':
      case 'failDelete':
        this.closeMsgBox()
        break
      case 'failDeactivate':
        this.closeMsgBox()
        this.closePopupForm()
        break
      case 'successEdit':
      default:
        this.goToPageMain()
        break
    }
  }
  onClickDelete() {
    this.deleteBanner(this.banner.id)
      .then(async () => {
        this.requestStatus = 'successDelete'
        this.secondBtn = { type: 'success', isPlain: true }
        this.openMsgBox()
        await sleep(1500)
        this.goToPageMain()
        this.closeMsgBox()
      })
      .catch(() => {
        this.requestStatus = 'failDelete'
        this.secondBtn = { type: 'danger', isPlain: true }
        this.openMsgBox()
      })
  }
  goToPageMain() { this.$router.push({ path: '/banners/list' }).catch(err => {}) }
  // STORE ACTIONS CALL
  updateBannerData() {
    // const id = Number(this.$route.params.id)
    // let banner = this.bannerById(id) || this.banner

    // if (!banner) {
    //   this.getBannerById(id)
    //     .then((res) => {
    //       banner = res
    //       this.updateFormByBannerData(banner)
    //       this.closeMsgBox()
    //       this.banner = banner
    //     })
    //     .catch(() => {
    //       this.requestStatus = 'failFetchBanner'
    //       this.secondBtn = { type: 'danger', isPlain: true }
    //       this.openMsgBox()
    //       return
    //     })
    // } else {
    //   this.updateFormByBannerData(banner)
    //   this.closeMsgBox()
    //   this.banner = banner
    // }
  }
  submitForm() {
    this.editBanner(this.banner.id)
      .then(async () => {
        this.requestStatus = 'successEdit'
        this.secondBtn = { type: 'success', isPlain: true }
        this.openMsgBox()
        await this.getList()
        // this.getBannerById(this.banner.id)
          .then(async () => {
            // this.banner = res
            this.banner = this.bannerById(this.banner.id)
            this.updateFormByBannerData(this.banner)
            await sleep(1500)
            this.closeMsgBox()
          })
      })
      .catch(error => {
        if (this.formIsValid) {
          if (error.bannerId) {
            this.bannerConflictId = error.bannerId
            this.openPopupForm()
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

    // if (!this.banner) {
    //   await this.getBannerById(Number(this.$route.params.id))
    //     .then((res) => {
    //       this.banner = res
    //       this.closeMsgBox()
    //     })
    //     .catch((error) => {
    //       this.requestStatus = 'failFetchBanner'
    //       this.secondBtn = { type: 'danger', isPlain: true }
    //       this.openMsgBox()
    //     })
    // }

    if (this.banner) this.updateFormByBannerData(this.banner)
  }
  deactivateBannerConflict() {
    this.deactivateBanner(this.bannerConflictId)
      .then(() => {
        console.log('Success deactivate!')
        this.closeMsgBox()
        this.closePopupForm()
        this.submitForm()
      })
      .catch(() => {
        console.log('Fail deactivate :(')
        this.requestStatus = 'failDeactivate'
        this.secondBtn = { type: 'danger', isPlain: true }
        this.openMsgBox()
      })
  }
  // POPUP-BANNER TOGGLE METHODS
  openPopupForm() {
    document.body.classList.add('modal-open')
    this.popupFormIsShown = true
  }
  closePopupForm() {
    document.body.classList.remove('modal-open')
    this.popupFormIsShown = false
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-edit

  &__container
    position relative
    display flex
    flex-direction column
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

  &__other
    position absolute
    top calc(100% + 100px)
    right 0
    left 0
</style>
