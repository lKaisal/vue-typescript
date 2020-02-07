<template lang="pug">
  include ../tools/bemto.pug

  +b.module-banners
    transition(mode="out-in")
      router-view(@updateList="loadData" class="module-banners__page page")
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="loadData" class="module-banners__msg-box modal")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import MessageBox from '@/modules/banners/components/MessageBox.vue'
import { bannersMapper } from '@/modules/banners/module/store'
import MsgBoxTools from '@/modules/banners/mixins/msgBoxTools'

const Mappers = Vue.extend({
  methods: {
    ...bannersMapper.mapActions(['getList'])
  }
})

@Component({
  components: {
    MessageBox,
  }
})

export default class ModuleBanners extends Mixins(Mappers, MsgBoxTools) {
  created() {
    this.loadData()
  }

  loadData() {
    // this.getList()
    //   .then(() => {
    //     console.log('List loaded!')
    //     this.closeMsgBox()
    //   })
    //   .catch(async (error) => {
    //     this.openMsgBox()
    //   })
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.module-banners

  &__page
    &.page-create
    &.page-edit
      width 100%
      display flex
      flex-grow 1
</style>
