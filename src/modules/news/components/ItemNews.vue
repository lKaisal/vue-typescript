<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-suppliers
    +e.info
      +e.cell.table-cell(v-for="(field, index) in fields" :key="index"
        :class=`[{ 'is-sticky': field.isSticky, 'col-075': field.isSmall, 'col-1': field.isMedium, 'col-15': field.isLarge,
          'col-3': field.isXLarge, 'is-centered': field.isCentered }]`)
        +e.cell-title(v-if="titleIsShown && field.title" v-html="`${field.title}:&ensp;`")
        +e.cell-text(v-if="field.field" v-html="getFieldContent(field)")
        ButtonApp(v-else :isLow="true" :isPlain="true" :fontSize="12" text="Открыть" @clicked="onBtnClick" class="item-suppliers__btn")
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { News, TableField } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'

@Component({
  components: {
    ButtonApp
  }
})

export default class ItemNews extends Vue {
  @Prop() supplier: News
  @Prop() fields: TableField[]
  @Prop() titleIsShown: boolean

  onBtnClick() {
    this.$emit('clicked')
  }
  getFieldContent(field: TableField) {
    const value = this.supplier[field.field]
    const isDateField = field.field === 'created_at' || field.field === 'updated_at'
    const published = field.field === 'published' || field.field === 'approved'
    const pushed = field.field === 'pushed'

    if (published) return value ? 'Да' : 'Нет'
    else if (pushed) return value ? 'Отправлен' : 'Не отправлен'
    else if (isDateField) return value.toString().match(/[^\s]+/)[0]
    else return value
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../common'

.item-suppliers

  &__info
    display flex
    width 100%
    +lt-md()
      flex-wrap wrap

  &__cell
    color $cPText
    line-height 1.25
    +gt-md()
      &:nth-of-type(2)
        fontMedium()
    +lt-md()
      display flex
      align-items flex-start
      flex-wrap wrap
      border-bottom none

  &__cell-title
    white-space nowrap
    fontMedium()
    margin-bottom 5px
</style>