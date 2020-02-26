<template lang="pug">
  include ../tools/bemto.pug

  +b.module-auth(v-loading.fullscreen.lock="isLoading")
    router-view
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import MessageBox from '@/components/MessageBox.vue'
import { authMapper } from '@/modules/auth/module/store'

const Mappers = Vue.extend({
  computed: {
    ...authMapper.mapState(['isLoading']),
  },
  methods: {
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
