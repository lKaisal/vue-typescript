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
            +e.EL-INPUT.input(:disabled="isLoading" placeholder="Логин" v-model="login")
            +e.error(v-html="formLogin.errorMsg")
          +e.field._pswd(:class="{ 'is-invalid': isInvalid(formPswd), 'is-filled': pswd }")
            +e.label
              +e.LABEL(for="pswd") Пароль
            +e.EL-INPUT.input(:disabled="isLoading" placeholder="Пароль" v-model="pswd" show-password)
            +e.error(v-html="formPswd.errorMsg")
          ButtonApp(btnType="primary" :isDisabled="!login || !pswd || isLoading" :icon="isLoading ? 'el-icon-loading' : ''" @clicked="onSubmit"
            text="Войти" class="page-main__btn")
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="closeMsgBox"
        class="list-features__msg-box modal modal-msg")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { Button } from '@/models'
import { FormField } from '../models'
import { authMapper } from '../module/store'
import sleep from '@/mixins/sleep'
import ButtonApp from '@/components/ButtonApp.vue'
import MessageBox from '@/components/MessageBox.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import animateIfVisible from '@/mixins/animateIfVisible'

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
    MessageBox
  },
  mixins: [
    MsgBoxTools
  ]
})

export default class PageMain extends Mixins(Mappers, MsgBoxTools) {
  get isLoading() { return this.form.isLoading }
  get login() { return this.formLogin.value }
  set login(value) { this.updateField({name: 'login', value}) }
  get pswd() { return this.formPswd.value }
  set pswd(value) { this.updateField({name: 'pswd', value}) }

  created() {
    this.clearForm()
  }

  isInvalid(field: FormField) { return this.form.validationIsShown && field.validationRequired && !field.isValid }
  onSubmit() {
    this.sendForm()
      .then(() => this.$emit('loggedIn'))
      .catch(async () => {
        if (this.formIsValid) {
          this.requestStatus = 'failLogin'
          this.openMsgBox()
          await sleep(3000)
          this.closeMsgBox()
        }
      })
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
    border 1px solid $cBaseBorder
    border-radius 5px
    +gt-sm()
      width 450px
    +xs()
      width 100%

  &__field
    position relative
    max-width 100%
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
    >>> input
      width-between-property 'font-size' 1001 14 1440 18 true true
    .is-filled &
      >>> input
        // font-weight 500
        border-color $cBrand
    .is-invalid &
      animation pulsate ease-in-out .5s both
      >>> input
        border-color $cDanger
</style>
