<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-edit.page(v-loading.fullscreen.lock="isLoading")
    +e.container
      +e.form-wrapper
        +e.H1.title.page-title Редактирование баннера
        FormBanners(class="page-edit__form")
        +e.btns
          +e.EL-BUTTON.btn(type="primary" :disabled="!isSmthToUpdate" @click="submitForm") Сохранить баннер
          +e.EL-BUTTON.btn(type="warning" :disabled="!isSmthToUpdate" plain @click="resetForm") Отменить изменения
          +e.EL-BUTTON.btn(type="danger" plain @click="onClickDelete") Удалить баннер
          +e.EL-BUTTON.btn(type="success" plain @click="goToPageMain") Вернуться к списку
    transition-group(tag="div")
      MessageBox(v-show="msgBoxIsShown" key="msg" :content="msgBoxContent" @close="onCloseClick" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClick" :secondBtn="secondBtn"
        class="page-edit__msg-box modal")
      PopupForm(v-if="popupFormIsShown && bannerConflict" key="popup" :banner="bannerConflict" @confirm="closePopupForm" @discard="closePopupForm" class="page-edit__popup modal")
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

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['list', 'isLoading', 'form']),
    ...bannersMapper.mapGetters(['bannerById', 'formIsValid', 'listActive', 'formSort'])
  },
  methods: {
    ...bannersMapper.mapMutations(['setFormType', 'clearForm']),
    ...bannersMapper.mapActions(['editBanner', 'deleteBanner', 'updateFormByBannerData', 'getBannerById', 'getList'])
  }
})

@Component({
  components: {
    FormBanners,
    MessageBox,
    PopupForm
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
        default:
          if ((banner[field.name] && banner[field.name].toString()) !== (field.value && field.value.toString())) return true
      }
    }

    return false
  }

  created() {
    this.setFormType('edit')
    this.updateBannerData()
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
    const id = Number(this.$route.params.id)
    let banner = this.bannerById(id) || this.banner

    if (!banner) {
      this.getBannerById(id)
        .then((res) => {
          banner = res
          this.updateFormByBannerData(banner)
          this.closeMsgBox()
          this.banner = banner
        })
        .catch(() => {
          this.requestStatus = 'failFetchBanner'
          this.secondBtn = { type: 'danger', isPlain: true }
          this.openMsgBox()
          return
        })
    } else {
      this.updateFormByBannerData(banner)
      this.closeMsgBox()
      this.banner = banner
    }
  }
  submitForm() {
    this.editBanner(this.banner.id)
      .then(async () => {
        this.requestStatus = 'successEdit'
        this.secondBtn = { type: 'success', isPlain: true }
        this.openMsgBox()
        await this.getList()
        this.banner = this.bannerById(this.banner.id)
        await sleep(1500)
        this.closeMsgBox()
      })
      .catch(error => {
        if (this.formIsValid) {
          this.bannerConflictId = this.listActive.find(b => b.sort === this.formSort.value) && this.listActive.find(b => b.sort === this.formSort.value).id
          if (this.bannerConflictId) this.openPopupForm()
          else {
            this.requestStatus = 'failEdit'
            this.secondBtn = { type: 'danger', isPlain: true }
            this.openMsgBox()
          }
        }
      })
  }
  async resetForm() {
    this.clearForm()

    if (!this.banner) {
      await this.getBannerById(Number(this.$route.params.id))
        .then((res) => {
          this.banner = res
          this.closeMsgBox()
        })
        .catch((error) => {
          this.requestStatus = 'failFetchBanner'
          this.secondBtn = { type: 'danger', isPlain: true }
          this.openMsgBox()
        })
    }

    if (this.banner) this.updateFormByBannerData(this.banner)
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
    width 100%
    display flex
    // &:before
    //   z-index -1
    //   content ''
    //   position fixed
    //   top 0
    //   right 0
    //   bottom 0
    //   left 0
    //   width 100vw
    //   height 100vh
    //   background-image url('http://frontend.crm-supplier.svc.k8s.stage/img/header.e4a2e38c.svg')
    //   background-repeat repeat

  &__form-wrapper
    // z-index 1
    grid-size(4, 4, 5.5, 5, 6)
    margin-right auto
    margin-left auto
    // min-height 100%
    align-self center
    // display flex
    // align-items center
    // width 100%
    background-color $cExLightBorder
    border-radius 6px
    +gt-sm()
      padding 50px
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

  &__btn
    margin-bottom 10px
</style>
