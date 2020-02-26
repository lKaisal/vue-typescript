<template lang="pug">
  include ../tools/bemto.pug

  +b.module-auth(v-loading.fullscreen.lock="isLoading")
    router-view
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import MessageBox from '@/modules/banners/components/MessageBox.vue'
import { authMapper } from '@/modules/auth/module/store'
// import MsgBoxTools from '@/modules/auth/mixins/msgBoxTools'

const Mappers = Vue.extend({
  computed: {
    ...authMapper.mapState(['isLoading']),
    // ...authMapper.mapGetters(['isLoading'])
  },
  methods: {
    // ...authMapper.mapMutations(['clearForm']),
    // ...authMapper.mapActions(['getList', 'getActiveAmount'])
  }
})

@Component({
  components: {
    MessageBox,
  }
})

export default class ModuleAuth extends Mixins(Mappers) {

}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.module-auth
  //
</style>
