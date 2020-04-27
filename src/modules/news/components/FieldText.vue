<template lang="pug">
  include ../../../tools/bemto.pug

  +b.field-text
    +e.container(v-if="!editMode")
      +e.title.card-field-title(v-html="field.title")
      +e.content.card-field-content
        +e.content-inner(v-html="field.value")
    +e.container(v-else)
      +e.title.card-field-title(v-html="field.title")
      +e.content.card-field-content
        +e.EL-INPUT.content-inner(v-model="editableText" type="textarea" :autosize="{ minRows: 2, maxRows: 10}" clearable :placeholder="field.title")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop } from 'vue-property-decorator'
import { News, TableField } from '../models'

@Component({
})

export default class FieldText extends Vue {
  @Prop() field: TableField
  @Prop() editMode: boolean

  // editable fields
  editableText: string = null

  mounted() {
    this.editableText = this.field.value.toString()
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.field-text

  &__content
    font-size 14px

  &__content-inner
    line-height 1.5 !important
    fontReg()
    >>> p
      line-height 1.5 !important
      fontReg()
    >>> span
      line-height 1.5 !important
      font inherit !important
</style>
