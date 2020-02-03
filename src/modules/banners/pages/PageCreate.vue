<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-create.page(v-loading="isLoading")
    +e.container
      +e.form-wrapper
        +e.H1.title.page-title Создание баннера
        FormApp(class="page-create__form")
        +e.btns
          +e.EL-BUTTON(type="primary" @click="submitForm") Сохранить баннер
          +e.EL-BUTTON(type="warning" plain @click="clearForm") Очистить форму
          +e.EL-BUTTON(type="danger" plain @click="goToPageMain") Отменить
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClick" :secondBtn="secondBtn" class="page-create__msg-box modal")
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { MsgBoxContent, Banner, Button } from '../models'
import MsgBoxTools from '../mixins/msgBoxTools'
import FormApp from '../components/FormApp.vue'
import MessageBox from '../components/MessageBox.vue'
import sleep from '@/mixins/sleep'
import { bannersMapper } from '../module/store'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['isLoading']),
    ...bannersMapper.mapGetters(['listSorted', 'formSort', 'bannerById', 'formIsValid'])
  },
  methods: {
    ...bannersMapper.mapMutations(['setFormType', 'clearForm']),
    ...bannersMapper.mapActions(['getList', 'deleteBanner', 'createBanner'])
  }
})

@Component({
  components: {
    FormApp,
    MessageBox
  }
})

export default class PageCreate extends Mixins(MsgBoxTools, Mappers) {
  bannerId: number = null
  secondBtn: Button = null

  created() {
    this.setFormType('create')
    this.clearForm()
  }

  // edit or retry to create
  onFirstBtnClick() {
    if (this.requestStatus === 'successCreate') this.goToPageEdit()
    else this.submitForm()
  }
  onSecondBtnClick() {
    if (this.requestStatus === 'successCreate') this.goToPageMain()
    else this.closeMsgBox()
  }
  submitForm() {
    this.createBanner()
      .then(async(id) => {
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
          this.secondBtn = { type: 'danger', isPlain: true }
          this.requestStatus = 'failCreate'
          this.openMsgBox()
        }
      })
  }
  goToPageMain() { this.$router.push({ path: '/banners/list' }).catch(err => {}) }
  goToPageEdit() { this.$router.push({ path: '/banners/edit', params: { id: this.bannerId.toString() } }).catch(err => {}) }
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
</style>
