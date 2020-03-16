<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-restart
    +e.info
      +e.cell.table-cell(v-for="(field, index) in fields"
        :class="{ 'col-05': field.isSmall, 'col-1': field.isMedium, 'col-2': !field.isSmall && !field.isMedium }")
        +e.checkbox.checkbox(v-if="index === 0" @click="onCheckboxClick" :class="{ 'is-active': isActive, 'is-hovered': checkboxIsHovered }")
          +e.checkbox-icon-wrapper.checkbox-icon-wrapper
            +e.I.checkbox-icon.el-icon-check.checkbox-icon
        +e.cell-content(v-else v-html="section[field.field]" @click="index === 1 && onCheckboxClick()"
          @mouseenter="setCheckboxIsHovered(index === 1)" @mouseleave="setCheckboxIsHovered(false)")
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { restartMapper } from '../module/store'
import { Service, TableField } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'

@Component({
  components: {
    ButtonApp
  }
})

export default class ItemFeatures extends Vue {
  @Prop() section: Service
  @Prop() isActive: boolean
  @Prop() fields: TableField[]

  descrIsShown: boolean = false
  checkboxIsHovered: boolean = false
  get cells() { return this.section && [ this.section.serviceName, this.section.replicas ] }

  onCheckboxClick() {
    this.$emit('checkboxClicked')
  }
  setCheckboxIsHovered(payload: boolean) {
    this.checkboxIsHovered = payload
  }
}
</script>

<style lang="stylus">
@import '../../../styles/tools'
@import '../common'

.item-restart

  &__info
    display flex
    +xs()
      flex-wrap wrap

  &__cell
    color $cPText
    &:nth-of-type(2)
      flex-grow 1
      fontMedium()

  &__cell-content
    display inline-block
    padding 10px
    margin -10px
    cursor pointer
</style>