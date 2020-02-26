<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page
    +e.container
      +e.form-wrapper
        +e.H3.form-title Вход в админку мобильного приложения
        +e.form
          +e.field._login(:class="{ 'is-invalid': isInvalid(formLogin), 'is-filled': login }")
            +e.label
              +e.LABEL(for="login") Логин
            +e.EL-INPUT.input(placeholder="Логин" v-model="login")
            +e.error(v-html="formLogin.errorMsg")
          +e.field._pswd(:class="{ 'is-invalid': isInvalid(formPswd), 'is-filled': pswd }")
            +e.label
              +e.LABEL(for="pswd") Пароль
            +e.EL-INPUT.input(placeholder="Пароль" v-model="pswd" show-password)
            +e.error(v-html="formPswd.errorMsg")
          ButtonApp(btnType="primary" @clicked="onSubmit" text="Войти" class="page-main__btn")
    //- transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" :secondBtn="secondBtn" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="closeMsgBox"
        class="list-features__msg-box modal modal-msg")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { FormField } from '../models'
import { authMapper } from '../module/store'
import sleep from '@/mixins/sleep'
import ButtonApp from '@/components/ButtonApp.vue'
// import MessageBox from '@/components/MessageBox.vue'
// import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
// import MsgBoxTools from '../mixins/MsgBoxTools'
import animateIfVisible from '@/mixins/animateIfVisible'
// import { EditPayload } from '../models'

const Mappers = Vue.extend({
  computed: {
    ...authMapper.mapState(['form']),
    ...authMapper.mapGetters(['formLogin', 'formPswd', 'formIsValid'])
  },
  methods: {
    ...authMapper.mapMutations(['updateField', 'clearForm']),
    ...authMapper.mapActions(['sendForm'])
  }
})

@Component({
  components: {
    ButtonApp,
  },
  mixins: [
    // MsgBoxTools
  ]
})

export default class PageMain extends Mixins(Mappers) {
  get login() { return this.formLogin.value }
  set login(value) { this.updateField({name: 'login', value}) }
  get pswd() { return this.formPswd.value }
  set pswd(value) { this.updateField({name: 'pswd', value}) }

  created() {
    this.clearForm()
  }

  isInvalid(field: FormField) { return this.form.validationIsShown && field.validationRequired && !field.isValid }
  goToPageBanners() {
    this.$router.push({ name: 'PageBanners' })
  }
  onSubmit() {
    this.sendForm()
      .then(() => this.goToPageBanners())
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-main

  &__container
    width 100%
    height 100%
    display flex
    flex-direction column
    flex-grow 1
    justify-content center
    align-items center

  &__form-title
    margin-bottom 20px
    text-align center

  &__form
    padding 40px
    width 450px
    border 1px solid $cBaseBorder
    border-radius 5px

  &__field
    max-width 450px
    position relative
    width-between-property 'margin-bottom' 1441 30 1920 35 true true
    transition()
    &.is-disabled
      pointer-events none
      >>> input
        background-color $cDisabled
        border-color $cLightBorder
        color $cPlaceholderText
        transition(background-color\, border-color\, color)
    &.v-enter
    &.v-leave-to
      opacity 0

  &__error
    position absolute
    top calc(100% + 7px)
    left 0
    fontLight()
    font-size 12px
    color $cDanger
    opacity 0
    transition()
    +lg()
      top calc(100% + 5px)
    .is-invalid &
      opacity 1

  &__label
    display block
    margin-bottom 10px
    fontLight()
    font-size 15px
    color $cPrimaryText
    white-space nowrap
    transition(opacity)

  &__input
    display block
    font-size 18px
    >>> input
      font-size 18px
    .is-filled &
      >>> input
        // font-weight 500
        border-color $cBrand
    .is-invalid &
      animation pulsate ease-in-out .5s both
      >>> input
        border-color $cDanger
</style>
