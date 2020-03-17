<template lang="pug">
  include ../tools/bemto.pug

  +b.module-auth
    router-view(@loggedIn="onLoggedIn")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import MessageBox from '@/components/MessageBox.vue'
import { authMapper } from '@/modules/auth/module/store'

const Mappers = Vue.extend({
  computed: {
    ...authMapper.mapState(['form']),
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
  onLoggedIn() {
    this.$emit('loggedIn')
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.module-auth
  //
</style>
