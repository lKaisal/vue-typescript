<template lang="pug">
  include ../../../tools/bemto.pug

  +b.info-supplier
    +e.H1.title.page-title Информация о пользователе
    +e.info-block
      +e.info
        +e.field._title
          +e.field-title(v-html="`${fields[0].title}:&nbsp;`")
          +e.field-content(v-html="currentSupplier[fields[0].field]")
        +e.row
          +e.column(v-for="(col, colIndex) in 2")
            +e.field(v-for="(field, index) in otherFields.slice(colIndex * itemsPerCol, colIndex * itemsPerCol + itemsPerCol)")
              +e.field-title(v-html="`${field.title}:&nbsp;`")
              +e.field-content(v-html="getFieldContent(field)")
    +e.phone-block
      transition(mode="out-in")
        +e.phone-title(v-if="!phoneManageIsShown" @click="showPhoneManage") Сменить номер телефона
        PhoneManage(v-else :id="currentSupplier.id" @confirm="onPhoneConfirm" @discard="hidePhoneManage" class="info-supplier__phone-manage")
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

const SuppliersMappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapGetters(['supplierByUserId'])
  },
  methods: {
  }
})

@Component({
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    ButtonApp,
    PhoneManage
  }
})

export default class InfoSupplier extends Mixins(SuppliersMappers, MsgBoxToolsApp, MsgBoxTools) {
  // @Prop() phoneManageIsShown: boolean

  phoneMangeIsShown: boolean = false
  fields: TableField[] = [
    { field: 'supplierName', title: 'Название поставщика' },
    { field: 'supplierId', title: 'SupplierID' },
    { field: 'userName', title: 'Имя пользователя' },
    { field: 'userId', title: 'UserID' },
    // { field: 'createdAt', title: 'Дата создания' },
    { field: 'inn', title: 'ИНН' },
    { field: 'phone', title: 'Телефон' },
    { field: 'email', title: 'E-mail' },
  ]
  itemsPerCol: number = 3

  get currentUserId() { return this.$route.params.userId }
  get currentSupplier() { return this.currentUserId && this.supplierByUserId(Number(this.currentUserId)) }
  get supplierName() { return this.fields[0] }
  get otherFields() { return this.fields.slice(1) }

  getFieldContent(field: TableField) {
    const isPhone = field.field === 'phone'
    return isPhone ? `+${this.currentSupplier[field.field]}` : this.currentSupplier[field.field]
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
    // this.$emit('showPhoneManage')
    this.phoneMangeIsShown = true
  }
  hidePhoneManage() {
    // this.$emit('hidePhoneManage')
    this.phoneMangeIsShown = false
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.info-supplier

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
    &:first-child
      margin-right 25%

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
    margin-bottom 7px
    fontMedium()

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
    cursor pointer
    transition(opacity)
    &:hover
      opacity .75
</style>
