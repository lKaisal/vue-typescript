<template lang="pug">
  include ../../tools/bemto.pug

  +b.checkbox-table
    +e.checkbox.checkbox(@click="onSelectAllClick()" :class="{ 'is-active': isActive, 'is-disabled': isDisabled }")
      +e.icon-wrapper.checkbox-icon-wrapper
        +e.I.icon.el-icon-check.checkbox-icon
      +e.text.checkbox-text(v-if="!!text" v-html="text")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Prop, Watch } from 'vue-property-decorator'

@Component({
})

export default class CheckboxTable extends Vue {
  @Prop() isActive: boolean
  @Prop() isDisabled: boolean
  @Prop() text: string

  // SELECT METHODS (CHECKBOX)
  onSelectAllClick() {
    this.$emit('selectAllClicked')
  }
}
</script>

<style lang="stylus" scoped>
@import '../../styles/tools'

.checkbox-table
  // 
</style>