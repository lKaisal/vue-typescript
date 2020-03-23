<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-supplier.page
    +e.container(v-if="currentSupplier && identity.data" v-click-outside="onClickOutside")
      +e.row-back(@click="goToPageMain")
        i(class="el-icon-back page-supplier__icon-back")
        +e.text-back Вернуться к списку
      CardSupplier(:supplier="currentSupplier" class="page-supplier__info-wrapper")
    transition-group(tag="div")
      MessageBox(v-show="msgBoxIsShown" key="msg" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="onSecondBtnClick" :secondBtn="secondBtn"
        class="page-supplier__msg-box modal modal-msg")
      PopupConflict(v-if="popupFormIsShown && currentSupplier" key="popup" :banner="currentSupplier" :dateStart="formActiveFrom.value"
        @confirm="onConflictConfirm" @discard="closePopupConflict" class="page-supplier__popup modal modal-conflict")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import vClickOuside from 'v-click-outside'
import MessageBox from '@/components/MessageBox.vue'
import { MsgBoxContent, Button } from '@/models'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import sleep from '@/mixins/sleep'
import { suppliersMapper } from '../module/store'
import { Supplier } from '../models'
import CardSupplier from '../components/CardSupplier.vue'
import animateIfVisible from '../../../mixins/animateIfVisible'
import MsgBoxTools from '../mixins/MsgBoxTools'

const SuppliersMappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapState(['identity']),
    ...suppliersMapper.mapGetters(['supplierByUserId'])
  },
  methods: {
    ...suppliersMapper.mapActions(['getIdentity'])
  }
})

@Component({
  directives: {
    clickOutside: vClickOuside.directive
  },
  components: {
    CardSupplier,
    MessageBox,
  }
})

export default class PageSupplier extends Mixins(MsgBoxTools, MsgBoxToolsApp, SuppliersMappers) {
  bannerId: number = null
  secondBtn: Button = null
  popupFormIsShown: boolean = false

  get failedFetchList() { return this.requestStatus === 'failFetchList' }
  get currentUserId() { return this.$route.params.userId }
  get currentSupplier() { return this.currentUserId && this.supplierByUserId(Number(this.currentUserId)) }

  // HOOKS
  async created() {
    await this.getIdentity()
    document.addEventListener('keydown', this.keydownHandler)
  }
  async mounted() {
    await this.$nextTick()
    animateIfVisible()
  }
  beforeDestroy() {
    document.removeEventListener('keydown', this.keydownHandler)
  }

  // CLICK HANDLERS
  onFirstBtnClick() {
    this.closeMsgBox()
    // switch (this.requestStatus) {
    //   case 'successCreate':
    //     this.goToPageEdit()
    //     break
    //   case 'failDeactivate':
    //     this.deactivateBannerConflict()
    //     break
    //   default:
    //     this.submitForm()
    //     break
    // }
  }
  onSecondBtnClick() {
    // switch (this.requestStatus) {
    //   case ('successCreate'):
    //     this.goToPageMain()
    //     break
    //   case 'failDeactivate':
    //     this.closeMsgBox()
    //     this.closePopupConflict()
    //     break
    //   default:
    //     this.closeMsgBox()
    //     break
    // }
  }
  goToPageMain() { this.$router.push({ name: 'PageSuppliers' }).catch(err => {}) }
  // OTHER HANDLERS
  keydownHandler(evt: KeyboardEvent) {
    if (evt.key === 'Escape') {
      // if (!this.msgBoxIsShown && !this.popupFormIsShown) this.goToPageMain()
      // if (this.popupFormIsShown) this.closePopupConflict()
      // else if (this.msgBoxIsShown) this.closeMsgBox()
      if (this.msgBoxIsShown) this.closeMsgBox()
    }
  }
  onClickOutside(evt) {
    const targetIsPage = evt.srcElement.classList.contains('page-supplier')
    if (targetIsPage) this.goToPageMain()
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-supplier

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
    .page-supplier__row-back:hover &
      transform translateX(-5px)

  &__text-back
    margin-left 10px
    white-space nowrap

  &__info-wrapper
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

  &__popup
    +lt-lg()
      display block
</style>
