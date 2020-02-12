<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-create.page(v-loading.fullscreen.lock="isLoading")
    +e.container
      +e.row-back(@click="goToPageMain")
        i(class="el-icon-back page-create__icon-back")
        +e.text-back Вернуться к списку
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
      PopupConflict(v-if="popupFormIsShown && bannerConflict" key="popup" :banner="bannerConflict" @confirm="deactivateBannerConflict" @discard="closePopupConflict" class="page-create__popup modal")
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

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['isLoading', 'form', 'activeAmount']),
    ...bannersMapper.mapGetters(['listActive', 'formSort', 'bannerById', 'formIsValid'])
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
    PopupConflict,
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
    document.addEventListener('keydown', this.keydownHandler)
  }
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydownHandler)
  }

  openPopupConflict() {
    document.body.classList.add('modal-open')
    this.popupFormIsShown = true
  }
  closePopupConflict() {
    document.body.classList.remove('modal-open')
    this.popupFormIsShown = false
    this.bannerConflictId = null
  }
  keydownHandler(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      if (!this.msgBoxIsShown && !this.popupFormIsShown) this.goToPageMain()
      else if (this.popupFormIsShown) this.closePopupConflict()
      else if (this.msgBoxIsShown) this.closeMsgBox()
    }
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
        this.closePopupConflict()
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
        await this.getList()
        await sleep(1500)
        if (this.isPageCreate) {
          this.closeMsgBox()
          this.goToPageEdit()
        }
      })
      .catch(error => {
        if (this.formIsValid) {
          if (error.bannerId) {
            this.bannerConflictId = error.bannerId
            // this.bannerConflictId = this.listActive.find(b => b.sort === this.formSort.value) && this.listActive.find(b => b.sort === this.formSort.value).id
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
        console.log('Success deactivate!')
        this.closeMsgBox()
        this.closePopupConflict()
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
