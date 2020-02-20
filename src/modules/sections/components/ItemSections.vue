<template lang="pug">
  include ../../../tools/bemto.pug

  +b.item-sections
    +e.info
      +e.cell.table-cell(v-for="(item, index) in cells" v-html="item" :class="index > 0 ? 'col-2' : 'col-1'")
      +e.cell._button.table-cell.col-2
        ButtonApp(:btnType="btnType" :text="btnText" :isPlain="true" :width="150" class="item-sections__btn")
    //- +e.descr-wrapper
      //- +e.
      +e.descr(v-if="section" v-html="section.description")
</template>

<script lang="ts">
import { Vue, Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import { sectionsMapper } from '../module/store'
import { Section } from '../models'
import ButtonApp from '@/components/ButtonApp.vue'

// const Mappers = Vue.extend({
//   // computed: {
//   //   ...sectionsMapper.mapState(['list'])
//   // }
// })

@Component({
  components: {
    ButtonApp
  }
})

export default class ItemSections extends Vue {
  @Prop() section: Section

  get cells() { return this.section && [ this.section.id, this.section.name, this.section.title ] }
  get isActive() { return this.section && this.section.isActive }
  get btnType() { return this.isActive ? 'warning' : 'primary' }
  get btnText() { return this.isActive ? 'Отключить' : 'Активировать' }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'
@import '../common'

.item-sections

  &__info
    display flex
    // justify-content space-between
    margin-bottom 25px

  &__id
    // width 50px
    border 1px solid $cBaseBorder

  &__name
  &__title
  &__status
    // grid-size(2, 2, 2, 2, 4)
    border 1px solid $cBaseBorder

  &__btn
    width 200px

  &__descr
    padding 10px
    border 1px solid $cBaseBorder
</style>