<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-edit.page
    +e.container
      +e.form-wrapper
        +e.H1.title.page-title Редактирование баннера
        FormApp(class="page-edit__form")
        +e.btns
          +e.EL-BUTTON.btn(type="primary" @click="submitForm") Сохранить баннер
          +e.EL-BUTTON.btn(type="warning" plain @click="resetForm") Отменить изменения
          +e.EL-BUTTON.btn(type="danger" plain @click="onClickDelete") Удалить баннер
          +e.EL-BUTTON.btn(type="success" plain @click="goToPageMain") Вернуться к списку
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" @close="onCloseClick" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClick" :secondBtn="secondBtn"
        class="page-edit__msg-box modal")
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { MsgBoxContent, Banner, RequestStatus, Button } from '../models'
import MsgBoxTools from '../mixins/msgBoxTools'
import FormApp from '../components/FormApp.vue'
import MessageBox from '../components/MessageBox.vue'
import sleep from '@/mixins/sleep'
import { bannersMapper } from '../module/store'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteUpdate'
])

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapGetters(['listSorted', 'formSort', 'bannerById'])
  },
  methods: {
    ...bannersMapper.mapMutations(['setFormType', 'clearForm']),
    ...bannersMapper.mapActions(['getList', 'deleteBanner', 'updateFormByBannerData', 'getBannerById'])
  }
})

@Component({
  components: {
    FormApp,
    MessageBox
  }
})

export default class PageEdit extends Mixins(MsgBoxTools, Mappers) {
  banner: Banner = null
  secondBtn: Button = null

  get formIsValid() { return this.formIsValid }

  created() {
    this.setFormType('edit')
    const id = Number(this.$route.params.id)
    let banner = this.bannerById(id)

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
          // vm.openMsgBox()
          return
        })
    } else {
      this.updateFormByBannerData(banner)
      this.closeMsgBox()
      this.banner = banner
    }
  }

  beforeDestroy() {
    this.clearForm()
  }

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
  goToPageMain() { this.$router.push({ name: 'PageBanners' }).catch(err => {}) }
  submitForm() {
    this.editBanner(this.banner.id)
      .then(async () => {
        this.requestStatus = 'successEdit'
        this.secondBtn = { type: 'success', isPlain: true }
        // this.openMsgBox()
        await sleep(1500)
        this.closeMsgBox()
      })
      .catch(error => {
        if (this.formIsValid) {
          this.requestStatus = 'failEdit'
          this.secondBtn = { type: 'danger', isPlain: true }
          // this.openMsgBox()
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
          // this.openMsgBox()
        })
    }

    if (this.banner) this.updateFormByBannerData(this.banner)
  }
  onClickDelete() {
    this.deleteBanner(this.banner.id)
      .then(async () => {
        this.requestStatus = 'successDelete'
        this.secondBtn = { type: 'success', isPlain: true }
        // this.openMsgBox()
        await sleep(1500)
        this.closeMsgBox()
        this.goToPageMain()
      })
      .catch(() => {
        this.requestStatus = 'failDelete'
        this.secondBtn = { type: 'danger', isPlain: true }
        // this.openMsgBox()
      })
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-edit

  &__container
    position relative
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
    min-height 100%
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
