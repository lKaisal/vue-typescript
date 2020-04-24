<template lang="pug">
  include ../../../tools/bemto.pug

  +b.card-news
    +e.H1.title.page-title Информация о пользователе
    +e.info-block
      +e.info
        +e.field._title
          +e.field-title(v-html="`${newsName.title}`")
          +e.field-content(v-html="news[newsName.field]")
        +e.row
          +e.column(v-for="(col, colIndex) in columns")
            +e.H4.subtitle(v-html="col.subtitle")
            +e.fields
              +e.field(v-for="(field, fIndex) in col.fields")
                +e.field-title(v-html="`${field.title}`")
                +e.field-content
                  +e.field-content-inner(v-html="getFieldContent(field, colIndex)")
                  +e.H5.field-manage(v-if="field.isVariable && getFieldContent(field, colIndex)" @click="onFieldManageClick(field)" v-html="field.variableText")
              //- +e.H5.field-manage._item(v-if="colIndex === 1" @click="emitUpdateIdentity" v-html="identityFieldManageText")
      +e.btns
        ButtonApp(btnType="primary" :isPlain="true" text="Обновить данные" @clicked="emitUpdateIdentity" class="card-news__btn")
        ButtonApp(btnType="danger" :isPlain="true" text="Удалить учетную запись" @clicked="emitDeleteIdentity" class="card-news__btn")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import { newsMapper } from '../module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import { News, TableField } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'
import vClickOutside from 'v-click-outside'

const NewsMappers = Vue.extend({
  computed: {
    // ...newsMapper.mapState(['identity']),
  },
  methods: {
    // ...newsMapper.mapActions(['getIdentity'])
  }
})

@Component({
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    ButtonApp,
  }
})

export default class CardNews extends Mixins(MsgBoxToolsApp, MsgBoxTools, NewsMappers) {
  @Prop() news: News
  @Prop() timer: number

  subtitles: string[] = ['Учетные данные', 'Контактная информация', 'Помощь с авторизацией']

  get identityFieldManageText() {
    return this.identity.error ? 'Загрузить данные' : 'Обновить данные'
  }

  getFieldContent(field: TableField, colIndex: number) {
    try {
      const isIdentityField = colIndex === 1
  
      if (isIdentityField) {
        const value = field.fields.map(f => this.identity.data[f]).join(' / ')
        const isStatus = field.fields.includes('status')
        const isExpire = field.fields.includes('lastCodeExpired')

        if (isStatus) return value ? 'Подтвержден' : 'Не подтвержден'
        else if (isExpire) return this.formattedTimer
        else return value
      } else {
        const value = this.news[field.field]
        const isPhone = field.field === 'phone'
        const isStatus = field.field === 'confirmed'
        const isCreatedAt = field.field === 'createdAt'
        const contracts = field.field === 'contractsNames'

        if (isPhone) return `+${value}`
        // else if (isCreatedAt) return value.toString().split(' ')[0]
        // @ts-ignore
        else if (contracts) return [...value].sort().join(' / ')
        else if (isStatus) return value ? 'Подтвержден' : 'Не подтвержден'
        else return value
      }
    } catch{}
  }
  // click methods
  onFieldManageClick(field: TableField | SmsTableField) {
    if (field.field === 'phone') this.showPhoneManage()
    else if (field.fields.includes('smsTryCount')) this.emitResetSmsCount('smsTryCount')
    else if (field.fields.includes('smsSendCount')) this.emitResetSmsCount('smsSendCount')
  }
  // emit methods
  showPhoneManage() {
    this.$emit('showPhoneManage')
  }
  emitResetSmsCount(field: keyof SmsFields) {
    this.$emit('resetSmsCount', field)
  }
  emitUpdateIdentity() {
    this.$emit('updateIdentity')
  }
  emitDeleteIdentity(){
    this.$emit('deleteIdentity')
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.card-news

  &__container
    position relative
    +xl()
      width 50vw
    +lg()
      width 55vw
    +md()
      width 65vw
    +lt-md()
      font-size 14px
    +sm()
      width 90vw
    +xs()
      width 100%
      height 100%
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
    +xs()
      margin-bottom 25px

  &__info-block
    width 100%
    // margin-bottom 50px

  &__row
    +gt-sm()
      display flex
      justify-content space-between
      flex-wrap wrap

  &__column
    position relative
    +gt-lg()
      width 33.3%
    +lt-lg()
      width 50%
    +xs()
      width 100%
    padding-top 5px
    +gt-md()
      padding-right 25px
      padding-left 25px
    +md()
      &:nth-of-type(3)
        margin-top 25px
        padding-top 25px
    +sm()
      &:first-child
        padding-right 25px
      &:nth-of-type(2)
        padding-left 25px
      &:nth-of-type(3)
        margin-top 25px
        padding-top 25px
    +xs()
      &:not(:last-child)
        margin-bottom 50px

  &__subtitle
    margin-bottom 25px

  &__fields
    &:not(:last-child)
      margin-bottom 25px

  &__field
    &:not(:last-child)
      margin-bottom 15px
    +xs()
      margin-bottom 15px
    &_title
      +gt-md()
        padding-right 25px
        padding-left 25px
      +gt-sm()
        margin-bottom 25px !important

  &__field-title
    margin-bottom 5px
    // fontMedium()
    color $cSecondaryText
    font-size 12px

  &__field-content
    display flex
    align-items center

  &__field-manage
    display inline
    padding 5px
    margin -5px 0
    margin-left 5px
    color $cBrand
    fontReg()
    cursor pointer
    transition(opacity\, border-color)
    transition-delay $tFast
    &:hover
      opacity .75
    &_item
      margin -5px
      color $cGreen
    &.is-disabled
      transition-delay 0s
      pointer-events none

  &__btns
    // margin-top 75px
    width-between-property 'margin-top' 600 40 1440 75 true true
    display flex
    flex-wrap wrap
    +gt-md()
      margin-right 25px
      margin-left 25px

  &__btn
    &:not(:last-child)
      margin-right 10px
      margin-bottom 10px
</style>
