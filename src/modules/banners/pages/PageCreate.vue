<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-create.page(v-loading.fullscreen.lock="isLoading")
    +e.container
      +e.form-wrapper
        +e.H1.title.page-title Создание баннера
        FormApp(class="page-create__form")
        +e.btns
          +e.EL-BUTTON(type="primary" @click="submitForm") Сохранить баннер
          +e.EL-BUTTON(type="warning" plain @click="clearForm") Очистить форму
          +e.EL-BUTTON(type="danger" plain @click="goToPageMain") Отменить
    transition-group(tag="div")
      MessageBox(v-show="msgBoxIsShown" key="msg" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClick" :secondBtn="secondBtn" class="page-create__msg-box modal")
      PopupForm(v-if="popupFormIsShown && bannerConflict" key="popup" :banner="bannerConflict" @confirm="closePopupForm" @discard="closePopupForm" class="page-create__popup modal")
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { MsgBoxContent, Banner, Button } from '../models'
import MsgBoxTools from '../mixins/msgBoxTools'
import FormApp from '../components/FormApp.vue'
import MessageBox from '../components/MessageBox.vue'
import PopupForm from '../components/PopupForm.vue'
import sleep from '@/mixins/sleep'
import { bannersMapper } from '../module/store'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['isLoading']),
    ...bannersMapper.mapGetters(['listSorted', 'listActive', 'formSort', 'bannerById', 'formIsValid'])
  },
  methods: {
    ...bannersMapper.mapMutations(['setFormType', 'clearForm']),
    ...bannersMapper.mapActions(['getList', 'deleteBanner', 'createBanner'])
  }
})

@Component({
  components: {
    FormApp,
    MessageBox,
    PopupForm
  }
})

export default class PageCreate extends Mixins(MsgBoxTools, Mappers) {
  bannerId: number = null
  secondBtn: Button = null
  bannerConflictId: number = null
  popupFormIsShown: boolean = false

  get bannerConflict() { return this.bannerById(this.bannerConflictId) }

  created() {
    this.setFormType('create')
    this.clearForm()
  }

  // CLICK HANDLERS
  onFirstBtnClick() {
    if (this.requestStatus === 'successCreate') this.goToPageEdit()
    else this.submitForm()
  }
  onSecondBtnClick() {
    if (this.requestStatus === 'successCreate') this.goToPageMain()
    else this.closeMsgBox()
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
        this.closeMsgBox()
        this.goToPageEdit()
      })
      .catch(error => {
        if (this.formIsValid) {
          this.bannerConflictId = this.listActive.find(b => b.sort === this.formSort.value) && this.listActive.find(b => b.sort === this.formSort.value).id
          if (this.bannerConflictId) this.openPopupForm()
          else {
            this.secondBtn = { type: 'danger', isPlain: true }
            this.requestStatus = 'failCreate'
            this.openMsgBox()
          }
        }
      })
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
    grid-size(4, 4, 4, 5, 6)
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

  &__popup
    // 
</style>
