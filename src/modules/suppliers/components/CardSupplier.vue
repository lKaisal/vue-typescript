<template lang="pug">
  include ../../../tools/bemto.pug

  +b.card-supplier
    +e.H1.title.page-title Информация о пользователе
    +e.info-block
      +e.info
        +e.field._title
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
                  +e.H5.field-manage(v-if="field.isVariable" @click="showPhoneInput") Изменить
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import { suppliersMapper } from '../module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import { Supplier, TableField } from '../models'
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

  subtitles: string[] = ['Учетные данные', 'Контактная информация', 'Помощь с авторизацией (SMS)']
  generalFields: TableField[] = [
    { field: 'supplierId', title: 'SupplierID' },
    { field: 'userName', title: 'Имя пользователя' },
    { field: 'userId', title: 'UserID' },
    { field: 'inn', title: 'ИНН' },
  ]
  contactFields: TableField[] = [
    { field: 'email', title: 'E-mail' },
    { field: 'phone', title: 'Телефон', isVariable: true },
  ]
  itemsPerCol: number = 3

  get supplierName(): TableField { return { field: 'supplierName', title: 'Название поставщика' } }
  get identityFields(): TableField[] {
    return [
      { field: 'isActive', title: 'Статус пользователя' },
      { field: 'lastSMS', title: 'Последний sms-код' },
      { field: 'smsAttempts', title: 'Кол-во попыток sms' },
      { field: 'visitDate', title: 'Дата последнего визита' },
    ]
  }
  get columns() {
    return [
      { subtitle: this.subtitles[0], fields: this.generalFields },
      { subtitle: this.subtitles[2], fields: this.identityFields },
      { subtitle: this.subtitles[1], fields: this.contactFields },
    ]
  }

  getFieldContent(field: TableField, colIndex: number) {
    const isIdentityField = colIndex === 1

    if (isIdentityField) {
      const value = this.identity.data[field.field]
      return field.field === 'isActive' ? (value ? 'Активен' : 'Неактивен') : value
    } else {
      const isPhone = field.field === 'phone'
      return isPhone ? `+${this.supplier[field.field]}` : this.supplier[field.field]
    }
  }
  showPhoneInput() {
    this.$emit('showPhoneInput')
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.card-supplier

  &__container
    position relative
    // margin 50px auto
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
    margin-bottom 50px

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
    // padding-bottom 5px
    &:first-child
      padding-right 25px
    +gt-lg()
      &:nth-of-type(2)
        padding-right 25px
      &:nth-of-type(3)
        padding-left 25px
    +gt-sm()
      &:nth-of-type(2)
        padding-left 25px
        // &:before
        //   content ''
        //   position absolute
        //   top 0
        //   bottom 0
        //   left 0
        //   width 1px
        //   height 100%
        //   background-color $cBaseBorder
    +md()
      &:nth-of-type(3)
        margin-top 25px
        padding-top 25px
    +sm()
      &:nth-of-type(3)
        margin-top 25px
        padding-top 25px
        // &:before
        //   content ''
        //   position absolute
        //   top 0
        //   right 0
        //   left 0
        //   width 100%
        //   height 1px
        //   background-color $cBaseBorder
    +xs()
      &:not(:last-child)
        margin-bottom 50px

  &__subtitle
    margin-bottom 25px

  &__fields
    &:not(:last-child)
      margin-bottom 25px

  &__field
    // display flex
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

  &__field-content-inner
    margin-right 15px

  &__field-manage
    display inline
    padding 0 5px
    // margin -5px
    // margin-bottom 0px
    color $cBrand
    // border-bottom 1px dashed $cBrand
    border-color $cBrand
    fontReg()
    cursor pointer
    transition(opacity\, border-color)
    transition-delay $tFast
    &:hover
      opacity .75
    &.is-disabled
      border-color transparent
      transition-delay 0s
      pointer-events none

  &__phone-manage
    width 100%
    min-height 50px
    // display flex
    // align-items center
</style>
