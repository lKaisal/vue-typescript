<template lang="pug">
  include ../../../tools/bemto.pug

  +b.card-supplier
    +e.H1.title.page-title Информация о пользователе
    +e.info-block
      +e.info
        //- +e.field._title
          +e.field-title(v-html="`${supplierName.title}`")
          +e.field-content(v-html="supplier[supplierName.field]")
        +e.row
          +e.column(v-for="(col, colIndex) in columns")
            +e.H4.subtitle(v-html="col.subtitle")
            +e.fields
              +e.field(v-for="(field, fIndex) in col.fields")
                +e.field-title(v-html="`${field.title}`")
                +e.field-content
                  +e.field-content-inner(v-html="getFieldContent(field, colIndex)")
                  +e.H5.field-manage(v-if="field.isVariable && getFieldContent(field, colIndex)" @click="onFieldManageClick(field)" v-html="field.variableText")
              //- +e.H5.field-manage._single(v-if="colIndex === 1" @click="emitUpdateIdentity" v-html="identityFieldManageText")
      +e.btns
        ButtonApp(btnType="primary" :isPlain="true" text="Обновить данные" @clicked="emitUpdateIdentity" class="card-supplier__btn")
        ButtonApp(btnType="danger" :isPlain="true" text="Удалить учетную запись" @clicked="emitDeleteIdentity" class="card-supplier__btn")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import { suppliersMapper } from '../module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import { Supplier, TableField, SmsFields, SmsTableField } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'
import vClickOutside from 'v-click-outside'

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
    clickOutside: vClickOutside.directive
  },
  components: {
    ButtonApp,
  }
})

export default class CardSupplier extends Mixins(MsgBoxToolsApp, MsgBoxTools, SuppliersMappers) {
  @Prop() supplier: Supplier
  @Prop() timer: number

  subtitles: string[] = ['Учетные данные', 'Контактная информация', 'Помощь с авторизацией']
  generalFields: TableField[] = [
    { field: 'supplierName', title: 'Название поставщика' },
    { field: 'createdAt', title: 'Дата регистрации' },
    // { field: 'confirmed', title: 'Статус пользователя' },
    { field: 'supplierId', title: 'SupplierID' },
    { field: 'userName', title: 'Имя пользователя' },
    { field: 'userId', title: 'UserID' },
    { field: 'inn', title: 'ИНН' },
  ]
  contactFields: TableField[] = [
    { field: 'email', title: 'E-mail' },
    { field: 'phone', title: 'Телефон', isVariable: true, variableText: 'Изменить' },
  ]
  itemsPerCol: number = 3

  get supplierName(): TableField { return { field: 'supplierName', title: 'Название поставщика' } }
  get identityFields() {
    return [
      { fields: ['status'], title: 'Статус пользователя' },
      // { fields: ['createdAt'], title: 'Дата регистрации' },
      { fields: ['lastVisit'], title: 'Дата последнего визита' },
      { fields: ['lastSmsCode'], title: 'Последний sms-код' },
      { fields: ['lastCodeExpired'], title: 'Код перестанет работать через:' },
      { fields: ['smsSendCount', 'sendMaxCount'], title: 'Кол-во высланных sms за сутки (текущее / макс.)', isVariable: true, variableText: 'Сбросить' },
      { fields: ['smsTryCount', 'tryMaxCount'], title: 'Кол-во попыток ввода sms (текущее / макс.)', isVariable: true, variableText: 'Сбросить' },
    ]
  }
  get columns() {
    return [
      { subtitle: this.subtitles[0], fields: this.generalFields },
      { subtitle: this.subtitles[2], fields: this.identityFields },
      { subtitle: this.subtitles[1], fields: this.contactFields },
    ]
  }
  get identityFieldManageText() {
    return this.identity.error ? 'Загрузить данные' : 'Обновить данные'
  }
  get formattedTimer() {
    let time: number | string = this.timer
    const secs = time % 60
    time = (time - secs) / 60
    const mins = time % 60
    const hours = (time - mins) / 60

    const formatItem = (i) => {
      const res = i > 9 ? i : '0' + i
      return String(res)
    }
    if (hours > 0) time = [formatItem(hours), formatItem(mins), formatItem(secs)].join(':')
    else time = [formatItem(mins), formatItem(secs)].join(':')

    return time
  }

  getFieldContent(field: TableField | SmsTableField, colIndex: number) {
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
        const value = this.supplier[field.field]
        const isPhone = field.field === 'phone'
        const isStatus = field.field === 'confirmed'
        const isCreatedAt = field.field === 'createdAt'

        if (isPhone) return `+${value}`
        // else if (isCreatedAt) return value.toString().split(' ')[0]
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

.card-supplier

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
    &_single
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
