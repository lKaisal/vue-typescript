<template lang="pug">
  include ../tools/bemto.pug

  +b.module-news.page(v-loading.fullscreen.lock="isLoading")
    transition(mode="out-in")
      router-view(class="module-news__page page")
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" :secondBtn="secondBtn" @close="goToPageApp"
        @firstBtnClicked="onFirstBtnClick()" @secondBtnClicked="goToPageApp()"
        class="module-news__msg-box modal modal-msg")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { newsMapper } from '@/modules/news/module/store'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '@/modules/news/mixins/MsgBoxTools'
import MessageBox from '@/components/MessageBox.vue'
import { Button } from '@/models'
import animateIfVisible from '@/mixins/animateIfVisible'
import { authMapper } from '@/modules/auth/module/store'

const NewsMappers = Vue.extend({
  computed: {
    ...newsMapper.mapState(['list']),
    ...newsMapper.mapGetters(['isLoading'])
  },
  methods: {
    ...newsMapper.mapActions(['getList']),
  }
})
const AuthMappers = Vue.extend({
  computed: {
    ...authMapper.mapGetters(['activeMenuSectionByLink'])
  }
})

@Component({
  components: {
    MessageBox
  }
})

export default class ModuleNews extends Mixins(NewsMappers, AuthMappers, MsgBoxToolsApp, MsgBoxTools) {
  secondBtn: Button = { type: 'success', isPlain: true }
  get link() { return this.$route && this.$route.matched && this.$route.matched[0].path.slice(1) }
  get activeSection() { return this.link && this.activeMenuSectionByLink(this.link) }

  created() {
    this.updateList()
  }

  goToPageApp() { this.$router.push({ path: '/' }) }
  onFirstBtnClick() {
    if (this.msgBoxIsShown) this.closeMsgBox()

    switch (this.requestStatus) {
      case 'failFetchList':
        this.updateList()
        break
    }

  }
  updateList() {
    if (this.list.isLoading) return

    this.getList()
      .catch((err) => {
        if (err && err.status && err.status.toString().slice(0, 2) == 40) this.$emit('goToPageAuth')
        else {
          this.requestStatus = 'failFetchList'
          this.openMsgBox()
        }
      })
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.module-news

  &__list
    grid-size(4, 4, 6, 8, 10)
    margin 0 auto
</style>
