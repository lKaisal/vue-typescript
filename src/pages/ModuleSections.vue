<template lang="pug">
  include ../tools/bemto.pug

  +b.module-sections
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import MessageBox from '@/modules/banners/components/MessageBox.vue'
import MsgBoxTools from '@/modules/banners/mixins/msgBoxTools'
// import { bannersMapper } from '@/modules/banners/module/store'

const Mappers = Vue.extend({
  // computed: {
  //   ...bannersMapper.mapState(['list']),
  //   ...bannersMapper.mapGetters(['isLoading'])
  // },
  // methods: {
  //   ...bannersMapper.mapMutations(['clearForm']),
  //   ...bannersMapper.mapActions(['getList', 'getActiveAmount'])
  // }
})

@Component({
  components: {
    MessageBox,
  }
})

export default class ModuleSections extends Mixins(Mappers, MsgBoxTools) {
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.module-banners
  //
</style>
