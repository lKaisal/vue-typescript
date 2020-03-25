<template lang="pug">
  include ../../../tools/bemto.pug

  +b.popup-conflict
    +e.container.modal-popup-container(v-click-outside="onClickOutside")
      +e.text(v-if="dateStart" v-html="`Выбранное поле сортировки занято другим баннером.<br>Если продолжить сохранение, этот баннер будет перезаписан <span>${dateStart}</span>.<br>Хотите продолжить?`")
      +e.text(v-else) Выбранное поле сортировки занято другим баннером.<br>Хотите заменить этот баннер?
      ItemBanner(:banner="banner" :editIconsShown="false" :isSmallImg="true" class="popup-conflict__item")
      +e.btns
        ButtonApp(btnType="primary" @clicked="confirm" :text="confirmText" class="popup-conflict__btn")
        ButtonApp(btnType="danger" @clicked="discard" text="Отмена" class="popup-conflict__btn")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import { bannersMapper } from '../module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import ItemBanner from '../components/ItemBanner.vue'
import { Banner } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'
import vClickOutside from 'v-click-outside'
import { uiMapper } from '@/modules/ui/module/store'

const UiMappers = Vue.extend({
  computed: {
    ...uiMapper.mapState(['breakpoint'])
  },
})

@Component({
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    ItemBanner,
    ButtonApp
  }
})

export default class PopupConflict extends Mixins(UiMappers, MsgBoxToolsApp, MsgBoxTools) {
  @Prop() banner: Banner
  @Prop() dateStart: string
  get isGtLg() { return this.breakpoint === 'lg' || this.breakpoint === 'xl' }
  get isLg() { return this.breakpoint === 'lg' }
  get confirmText() { return this.dateStart ? 'Подтвердить' : 'Заменить' }

  confirm() {
    this.$emit('confirm')
  }
  discard() {
    this.$emit('discard')
  }
  onClickOutside(evt) {
    const targetIsModal = evt.srcElement.classList.contains('modal-conflict')
    if (targetIsModal) this.discard()
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.popup-conflict

  &__container
    margin 50px auto
    +xl()
      max-width 60vw
    +lg()
      max-width 60vw
    +md()
      max-width 60vw
    +sm()
      max-width 90vw

  &__text
    margin-bottom 50px
    line-height 1.25
    >>> span
      fontMedium()
      white-space nowrap

  &__item
    margin-bottom 25px

  &__btns
    display flex
    justify-content center

  &__btn
    &:not(:last-child)
      margin-right 10px
</style>
