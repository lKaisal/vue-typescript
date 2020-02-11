<template lang="pug">
  include ../../../tools/bemto.pug

  +b.popup-conflict
    +e.container.modal-popup-container
      +e.text Выбранное поле сортировки занято другим баннером.<br>Хотите заменить этот баннер?
      ItemBanner(:banner="banner" :editIconsShown="false" class="popup-conflict__item")
      +e.btns
        ButtonApp(btnType="primary" @clicked="confirm" text="Заменить" class="popup-conflict__btn")
        ButtonApp(btnType="danger" @clicked="discard" text="Отмена" class="popup-conflict__btn")
        //- +e.EL-BUTTON(type="primary" @click="confirm") Заменить
        //- +e.EL-BUTTON(type="danger" @click="discard") Отмена
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import { bannersMapper } from '../module/store'
import MsgBoxTools from '../mixins/msgBoxTools'
import ItemBanner from '../components/ItemBanner.vue'
import { Banner } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'

const Mappers = Vue.extend({
  methods: {
  }
})

@Component({
  components: {
    ItemBanner,
    ButtonApp
  }
})

export default class PopupConflict extends Mixins(Mappers, MsgBoxTools) {
  @Prop() banner: Banner

  confirm() {
    this.$emit('confirm')
  }

  discard() {
    this.$emit('discard')
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.popup-conflict

  &__container
    //

  &__text
    margin-bottom 50px
    fontMedium()
    line-height 1.25

  &__item
    margin-bottom 25px

  &__btns
    display flex
    justify-content center

  &__btn
    &:not(:last-child)
      margin-right 10px
</style>
