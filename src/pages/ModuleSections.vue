<template lang="pug">
  include ../tools/bemto.pug

  +b.module-sections.page(v-loading.fullscreen.lock="isLoading")
    +e.H1.title.page-title Sections Module
    ListSections(class="module-sections__list")
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="updateList" class="module-sections__msg-box modal modal-msg")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { sectionsMapper } from '@/modules/sections/module/store'
import ListSections from '@/modules/sections/components/ListSections.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '@/modules/sections/mixins/MsgBoxTools'
import MessageBox from '@/components/MessageBox.vue'

const Mappers = Vue.extend({
  computed: {
    ...sectionsMapper.mapState(['list']),
    ...sectionsMapper.mapGetters(['isLoading'])
  },
  methods: {
    ...sectionsMapper.mapActions(['getList']),
  }
})

@Component({
  components: {
    ListSections,
    MessageBox
  }
})

export default class ModuleSections extends Mixins(Mappers, MsgBoxToolsApp, MsgBoxTools) {
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

.module-sections

  &__list
    grid-size(4, 4, 6, 8, 10)
    margin 0 auto
</style>
