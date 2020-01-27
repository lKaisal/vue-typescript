<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-create.page
    +e.container
      +e.form-wrapper
        +e.H1.title.page-title Создание баннера
        FormCreate(class="page-create__form")
        +e.btns
          +e.EL-BUTTON(type="primary" @click="submitForm") Сохранить баннер
          +e.EL-BUTTON(type="warning" plain @click="clearForm") Очистить форму
          +e.EL-BUTTON(type="danger" plain @click="goToPageMain") Отменить
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" :loading="msgBoxIsLoading" @close="closeMsgBox" @reset="submitForm" class="page-create__msg-box modal")
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
import { MsgBoxContent } from '../models'
import MsgBoxTools from '../mixins/msgBoxTools'
import FormCreate from '../components/FormCreate.vue'
import MessageBox from '../components/MessageBox.vue'
import { bannersMapper } from '../module/store'

const Mappers = Vue.extend ({
  computed: {
    ...bannersMapper.mapGetters([
      'formIsValid'
    ])
  },
  methods: {
    ...bannersMapper.mapMutations([
      'clearForm'
    ]),
    ...bannersMapper.mapActions([
      'createBanner'
    ])
  }
})

@Component({
  components: {
    FormCreate,
    MessageBox
  }
})

export default class PageCreate extends Mixins(Mappers, MsgBoxTools) {
  msgBoxIsShown: boolean = false
  msgBoxIsLoading: boolean = false
  msgBoxContent: MsgBoxContent = {
    title: 'Ошибка при отправке',
    msg: 'Не удалось отправить данные',
    loadBtn: 'Отправить повторно',
  }

  submitForm() {
    this.createBanner()
      .catch(error => {
        console.log(error)
        if (this.formIsValid) {
          this.onErrorCatch()
        }
      })
  }
  goToPageMain() { this.$router.push({ name: 'PageBanners' }) }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-create

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
    grid-size(4, 4, 4, 5, 6)
    margin-right auto
    margin-left auto
    min-height 100%
    // display flex
    // align-items center
    padding 50px
    // width 100%
    background-color $cExLightBorder
    border-radius 6px

  &__btns
    position relative
    margin-top 60px
    display flex
    align-items flex-end
</style>
