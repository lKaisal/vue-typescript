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
          +e.column._general
            +e.field(v-for="(field, index) in generalFields")
              +e.field-title(v-html="`${field.title}`")
              +e.field-content(v-html="getFieldContent(field)")
          +e.column._contact
            +e.H4.subtitle Контактная информация
            +e.field(v-for="(field, index) in contactFields")
              +e.field-title(v-html="`${field.title}`")
              +e.field-content(v-html="getFieldContent(field)")
            +e.phone-block
              transition(mode="out-in")
                +e.H5.phone-title(v-if="!phoneManageIsShown" @click="showPhoneManage") Сменить номер телефона
                PhoneManage(v-else :id="supplier.id" @confirm="onPhoneConfirm" @discard="hidePhoneManage" class="card-supplier__phone-manage")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import { suppliersMapper } from '../module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import { Supplier, TableField } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'
import vClickOutside from 'v-click-outside'
import PhoneManage from '../components/PhoneManage.vue'

@Component({
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    ButtonApp,
    PhoneManage
  }
})

export default class CardSupplier extends Mixins(MsgBoxToolsApp, MsgBoxTools) {
  @Prop() supplier: Supplier
  @Prop() phoneManageIsShown: boolean

  phoneMangeIsShown: boolean = false
  generalFields: TableField[] = [
    { field: 'supplierId', title: 'SupplierID' },
    { field: 'userName', title: 'Имя пользователя' },
    { field: 'userId', title: 'UserID' },
    // { field: 'createdAt', title: 'Дата создания' },
    { field: 'inn', title: 'ИНН' },
  ]
  contactFields: TableField[] = [
    { field: 'email', title: 'E-mail' },
    { field: 'phone', title: 'Телефон' },
  ]
  itemsPerCol: number = 3

  get supplierName(): TableField { return { field: 'supplierName', title: 'Название поставщика' } }

  getFieldContent(field: TableField) {
    const isPhone = field.field === 'phone'
    return isPhone ? `+${this.supplier[field.field]}` : this.supplier[field.field]
  }
  onPhoneConfirm(phone) {
    this.$emit('editPhone', phone)
  }
  discard() {
    this.$emit('discard')
  }
  onClickOutside(evt) {
    const targetIsModal = evt.srcElement.classList.contains('modal-popup')
    if (targetIsModal) this.discard()
  }
  showPhoneManage() {
    this.$emit('showPhoneManage')
    // this.phoneMangeIsShown = true
  }
  hidePhoneManage() {
    this.$emit('hidePhoneManage')
    // this.phoneMangeIsShown = false
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

  &__column
    position relative
    width 50%
    // padding-top 10px
    // padding-bottom 10px
    &:first-child
      padding-right 25px
    &:last-child
      padding-left 25px
      &:before
        content ''
        position absolute
        top 0
        bottom 0
        left 0
        width 1px
        height 100%
        background-color $cBaseBorder

  &__subtitle
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

  &__phone-block
    width 100%
    min-height 40px
    display flex
    align-items center

  &__phone-title
  &__phone-manage
    transition(opacity)
    &.v-enter
    &.v-elave-to
      opacity 0

  &__phone-title
    display inline
    padding 5px
    margin -5px
    color $cBrand
    border-bottom 1px dashed $cBrand
    fontReg()
    cursor pointer
    transition(opacity)
    &:hover
      opacity .75
</style>
