<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-create.page(v-loading.fullscreen.lock="isLoading")
    +e.container
      +e.form-wrapper
        +e.H1.title.page-title Создание баннера
        FormBanners(class="page-create__form")
        +e.btns
          ButtonApp(btnType="primary" :disabled="!isSmthToCommit" @clicked="submitForm" text="Сохранить баннер" class="page-create__btn")
          ButtonApp(btnType="warning" :disabled="!isSmthToCommit" :isPlain="true" @clicked="clearForm" text="Очистить форму" class="page-create__btn")
          ButtonApp(btnType="danger" :isPlain="true" @clicked="goToPageMain" text="Отменить" class="page-create__btn")
          //- +e.EL-BUTTON(type="primary" @click="submitForm") Сохранить баннер
          //- +e.EL-BUTTON(type="warning" plain @click="clearForm") Очистить форму
          //- +e.EL-BUTTON(type="danger" plain @click="goToPageMain") Отменить
    transition-group(tag="div")
      MessageBox(v-show="msgBoxIsShown" key="msg" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClick" :secondBtn="secondBtn" class="page-create__msg-box modal")
      PopupForm(v-if="popupFormIsShown && bannerConflict" key="popup" :banner="bannerConflict" @confirm="deactivateBannerConflict" @discard="closePopupForm" class="page-create__popup modal")
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { MsgBoxContent, Banner, Button } from '../models'
import MsgBoxTools from '../mixins/msgBoxTools'
import FormBanners from '../components/FormBanners.vue'
import MessageBox from '../components/MessageBox.vue'
import PopupForm from '../components/PopupForm.vue'
import sleep from '@/mixins/sleep'
import { bannersMapper } from '../module/store'
import ButtonApp from '@/components/ButtonApp.vue'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['isLoading', 'form', 'activeAmount']),
    ...bannersMapper.mapGetters(['listSorted', 'listActive', 'formSort', 'bannerById', 'formIsValid'])
  },
  methods: {
    ...bannersMapper.mapMutations(['setFormType', 'clearForm']),
    ...bannersMapper.mapActions(['getList', 'deleteBanner', 'createBanner', 'deactivateBanner'])
  }
})

@Component({
  components: {
    FormBanners,
    MessageBox,
    PopupForm,
    ButtonApp
  }
})

export default class PageCreate extends Mixins(MsgBoxTools, Mappers) {
  bannerId: number = null
  secondBtn: Button = null
  bannerConflictId: number = null
  popupFormIsShown: boolean = false

  get bannerConflict() { return this.bannerById(this.bannerConflictId) }
  get isPageCreate() { return this.$route.path.includes('/banners/create') }
  get isSmthToCommit() {
    // check if any field was changed
    const form = this.form.data
    const sortToCommit = form.find(f => f.name === 'sort').value.toString() !== this.activeAmount.toString()
    const isActiveToCommit = !form.find(f => f.name === 'isActive').value
    const smthElseToCommit = form.filter(f => f.name !== 'isActive' && f.name !== 'sort').map(f => f.value).some(f => !!f)

    return sortToCommit || smthElseToCommit || isActiveToCommit
  }

  created() {
    this.setFormType('create')
    this.clearForm()
  }

  openPopupForm() {
    document.body.classList.add('modal-open')
    this.popupFormIsShown = true
  }
  closePopupForm() {
    document.body.classList.remove('modal-open')
    this.popupFormIsShown = false
    this.bannerConflictId = null
  }
  // CLICK HANDLERS
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
        this.closePopupForm()
        break
      default:
        this.closeMsgBox()
        break
    }
  }
  goToPageMain() { this.$router.push({ path: '/banners/list' }).catch(err => {}) }
  goToPageEdit() { this.$router.push({ path: `/banners/edit/${this.bannerId.toString()}` }).catch(err => {}) }
  // STORE ACTIONS CALL
  submitForm() {
    this.createBanner()
      .then(async (id) => {
        this.bannerId = id
        this.secondBtn = { type: 'success', isPlain: true }
        this.requestStatus = 'successCreate'
        this.openMsgBox()
        await sleep(1500)
        if (this.isPageCreate) {
          this.closeMsgBox()
          this.getList()
          this.goToPageEdit()
        }
      })
      .catch(error => {
        debugger
        if (this.formIsValid) {
          if (error.bannerId) {
            this.bannerConflictId = error.bannerId
            // this.bannerConflictId = this.listActive.find(b => b.sort === this.formSort.value) && this.listActive.find(b => b.sort === this.formSort.value).id
            this.openPopupForm()
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
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-create

  &__container
    position relative
    display flex
    width 100%
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
    grid-size(4, 4, 5.5, 5, 7)
    margin-right auto
    margin-left auto
    // min-height 100%
    // display flex
    // align-items center
    padding 50px
    align-self center
    // width 100%
    background-color $cExLightBorder
    border-radius 6px

  &__btns
    position relative
    margin-top 60px
    display flex
    align-items flex-end

  &__btn
    &:not(:last-child)
      margin-right 10px

  &__popup
    // 
</style>
