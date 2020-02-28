<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-restart
    +e.info
      +e.cell.table-cell.col-05
        +e.checkbox.checkbox-restart(@click="onCheckboxClick" :class="{ 'is-active': isActive }")
          +e.I.checkbox-icon.el-icon-check
      +e.cell.table-cell(v-for="(item, index) in cells" :class="{ 'col-1': index === 1 }")
        +e.cell-content(v-html="item" @click="index === 0 && onCheckboxClick()")
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { restartMapper } from '../module/store'
import { Service } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'

@Component({
  components: {
    ButtonApp
  }
})

export default class ItemFeatures extends Vue {
  @Prop() section: Service
  @Prop() isActive: boolean

  descrIsShown: boolean = false
  get cells() { return this.section && [ this.section.serviceName, this.section.replicas ] }

  onCheckboxClick() {
    this.$emit('checkboxClicked')
  }
}
</script>

<style lang="stylus" scoped>
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