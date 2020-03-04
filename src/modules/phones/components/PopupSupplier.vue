<template lang="pug">
  include ../../../tools/bemto.pug

  +b.popup-supplier
    +e.container.modal-popup-container(v-click-outside="onClickOutside")
      +e.btn-close(@click="discard")
        +e.I.icon-close.el-icon-close.modal-icon-close
      +e.H3.title Информация о пользователе
      +e.info
        +e.row(v-for="(field, index) in infoFields")
          +e.info-title(v-html="`${infoTitles[index]}:&nbsp;`")
          +e.info-content(v-html="supplier[field]")
      +e.btns
        ButtonApp(btnType="primary" @clicked="confirm" text="Подтвердить" class="popup-supplier__btn")
        ButtonApp(btnType="danger" @clicked="discard" text="Отмена" class="popup-supplier__btn")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
// import { phonesMappers } from '../module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import { Supplier } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'
import vClickOutside from 'v-click-outside'

const Mappers = Vue.extend({
  methods: {
  }
})

@Component({
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    ButtonApp
  }
})

export default class PopupSupplier extends Mixins(Mappers, MsgBoxToolsApp, MsgBoxTools) {
  @Prop() supplier: Supplier
  infoTitles: string[] = [ 'id', 'Название', 'ИНН', 'Телефон', 'E-mail']
  infoFields: (keyof Supplier)[] = [ 'id', 'name', 'inn', 'phone', 'email' ]

  confirm() {
    this.$emit('confirm')
  }
  discard() {
    this.$emit('discard')
  }
  onClickOutside(evt) {
    const targetIsModal = evt.srcElement.classList.contains('modal-popup')
    if (targetIsModal) this.discard()
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.popup-supplier

  &__container
    position relative
    margin 50px auto
    +gt-lg()
      max-width 70vw
      width 70vw
    +md()
      max-width 60vw
      width 60vw
    +sm()
      max-width 90vw
      width 90vw
    +xs()
      max-width 100vw
      width 100vw
      height 100vh
      display flex
      flex-direction column
      justify-content center
      align-items center

  &__btn-close
    position absolute
    top 15px
    right 15px
    cursor pointer

  &__title
    margin-bottom 50px
    text-align center

  &__text
    margin-bottom 50px
    line-height 1.25
    >>> span
      fontMedium()
      white-space nowrap

  &__info
    margin-bottom 25px

  &__row
    display flex
    &:not(:last-child)
      margin-bottom 10px

  &__info-title
    fontMedium()

  &__btns
    display flex
    justify-content center

  &__btn
    &:not(:last-child)
      margin-right 10px
</style>
