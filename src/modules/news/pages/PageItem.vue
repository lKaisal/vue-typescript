<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-news.page
    +e.container(v-if="currentNews" v-click-outside="onClickOutside")
      RowBack(text="Вернуться к списку" @clicked="goToPageMain" class="page-news__row-back")
      //- CardNews(:news="currentNews" :timer="timerValue" @showPhoneManage="showPhoneManage" @resetSmsCount="initSmsCountReset"
        @updateIdentity="getCurrentNews" @deleteIdentity="initDeleteIdentity"
        class="page-news__info-wrapper")
    transition-group(tag="div")
      MessageBox(v-show="msgBoxIsShown" key="msg" :content="msgBoxContent" @close="closeMsgBox"
        @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClick" :secondBtn="secondBtn"
        class="page-news__msg-box modal modal-msg")
      //- PhoneManage(v-show="phoneManageIsShown" key="phone" :inputIsShown="phoneManageIsShown" :prevNumber="currentNews.phone"
          @confirm="onEditPhone" @discard="hidePhoneManage"
          class="page-news__phone-manage modal modal-phone")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import vClickOuside from 'v-click-outside'
import MessageBox from '@/components/MessageBox.vue'
import { MsgBoxContent, Button } from '@/models'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import sleep from '@/mixins/sleep'
import { newsMapper } from '../module/store'
import { News } from '../models'
// import CardNews from '../components/CardNews.vue'
// import PhoneManage from '../components/PhoneManage.vue'
import animateIfVisible from '../../../mixins/animateIfVisible'
import MsgBoxTools from '../mixins/MsgBoxTools'
import RowBack from '@/components/RowBack.vue'

const NewsMappers = Vue.extend({
  computed: {
    ...newsMapper.mapState(['currentNews']),
    ...newsMapper.mapGetters(['newsById'])
  },
  methods: {
    // ...newsMapper.mapMutations(['clearIdentity']),
    ...newsMapper.mapActions(['getCurrentNews'])
  }
})

@Component({
  directives: {
    clickOutside: vClickOuside.directive
  },
  components: {
    // CardNews,
    MessageBox,
    // PhoneManage,
    RowBack
  }
})

export default class PageNews extends Mixins(MsgBoxTools, MsgBoxToolsApp, NewsMappers) {
  secondBtn: Button = null

  get failedFetchList() { return this.requestStatus === 'failFetchList' }
  get currentId() { return this.$route.params.id }
  // get currentNews() { return this.currentId && this.newsById(Number(this.currentId)) }

  // HOOKS
  created() {
    this.getData()
    document.addEventListener('keydown', this.keydownHandler)
  }
  async mounted() {
    await this.$nextTick()
    animateIfVisible()
  }
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydownHandler)
    // this.clearIdentity()
  }

  goToPageMain() { this.$router.push({ name: 'PageNews' }).catch(err => {}) }
  // IDENTITY DATA METHODS
  getData() {
    this.getCurrentNews(Number(this.currentId))
      .then(() => {
        // 
      })
      .catch(() => {
        this.requestStatus = 'failFetchCurrentNews'
        this.secondBtn = { type: 'success', isPlain: true }
        this.openMsgBox()
        return
      })
  }
  initDeleteIdentity() {
    // this.requestStatus = 'beforeDeleteIdentity'
    // this.secondBtn = { type: 'danger', isPlain: true }
    // this.openMsgBox()
  }
  deleteIdentity() {
    // this.destroyIdentityTimer()
    // this.deletePhoneAuth(Number(this.currentId))
    //   .then(async () => {
    //     this.requestStatus = 'successDeleteIdentity'
    //     this.openMsgBox()
    //     await sleep(3000)
    //     this.closeMsgBox()
    //     this.goToPageMain()
    //   })
    //   .catch(() => {
    //     this.requestStatus = 'failDeleteIdentity'
    //     this.secondBtn = { type: 'danger', isPlain: true }
    //     this.openMsgBox()
    //     return
    //   })
  }
  // CLICK HANDLERS
  onFirstBtnClick() {
    this.closeMsgBox()
    // switch (this.requestStatus) {
    //   case 'failEdit':
    //     this.onEditPhone()
    //     break;
    //   case 'failFetchIdentity':
    //     this.getCurrentNews()
    //     break
    //   case 'failResetSmsTryCount':
    //     this.initSmsCountReset(this.smsReset.field)
    //     break
    //   case 'successDeleteIdentity':
    //     this.goToPageMain()
    //     break
    //   case 'failDeleteIdentity':
    //   case 'beforeDeleteIdentity':
    //     this.deleteIdentity()
    //     break
    // }
  }
  onSecondBtnClick() {
    this.closeMsgBox()
    // switch (this.requestStatus) {
    //   case 'successEdit':
    //     this.goToPageMain()
    //     break
    // }
  }
  // OTHER HANDLERS
  keydownHandler(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      if (this.msgBoxIsShown) this.closeMsgBox()
    }
  }
  onClickOutside(evt) {
    const targetIsPage = evt.srcElement.classList.contains('page-news')
    if (targetIsPage) this.goToPageMain()
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-news

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
    width-between-property 'top' 600 -30 1000 -20 true false
    width-between-property 'top' 1000 -20 1440 -40 false false
    width-between-property 'top' 1441 -40 1920 -50 false true
    +gt-md()
      position absolute
      left 0
    +lt-md()
      margin-bottom 25px

  &__info-wrapper
    padding-top 50px
    padding-bottom 50px
    width 100%
    +gt-sm()
      width-between-property 'padding-right' 601 25 1000 50 true true
      width-between-property 'padding-left' 601 25 1000 50 true true
      border-radius 6px
      border 2px solid $cBrand
      box-shadow 0 1rem 3rem rgba(0,0,0,.175)!important
    +xs()
      position relative
      left 50%
      transform translateX(-50%)
      width 100vw
      padding-top 25px
      padding-bottom 25px
      width-between-property 'padding-right' 375 25 600 50 true true
      width-between-property 'padding-left' 375 25 600 50 true true
    &.v-enter
      jsVoaStart()
</style>
