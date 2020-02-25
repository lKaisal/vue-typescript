<template lang="pug">
  include ../tools/bemto.pug

  +b.module-features.page(v-loading.fullscreen.lock="isLoading")
    +e.H1.title.page-title Features Module
    ListFeatures(class="module-features__list")
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="updateList" class="module-features__msg-box modal modal-msg")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { featuresMapper } from '@/modules/features/module/store'
import ListFeatures from '@/modules/features/components/ListFeatures.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '@/modules/features/mixins/MsgBoxTools'
import MessageBox from '@/components/MessageBox.vue'

const Mappers = Vue.extend({
  computed: {
    ...featuresMapper.mapState(['list']),
    ...featuresMapper.mapGetters(['isLoading'])
  },
  methods: {
    ...featuresMapper.mapActions(['getList']),
  }
})

@Component({
  components: {
    ListFeatures,
    MessageBox
  }
})

export default class ModuleFeatures extends Mixins(Mappers, MsgBoxToolsApp, MsgBoxTools) {
  created() {
    this.updateList()
  }

  updateList() {
    if (this.list.isLoading) return

    if (this.msgBoxIsShown) this.closeMsgBox()

    this.getList()
      .catch(() => {
        this.requestStatus = 'failFetchList'
        this.openMsgBox()
      })
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.module-features

  &__list
    grid-size(4, 4, 6, 8, 10)
    margin 0 auto
</style>
