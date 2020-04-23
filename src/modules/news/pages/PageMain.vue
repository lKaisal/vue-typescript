<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page
    +e.container
      +e.title.H1.page-title(v-html="activeSection && activeSection.title")
      ListNews(:list="currentList" class="page-main__list")
      PaginationApp(:total="listSorted && listSorted.length" :pageSize="pageSize" :pagerCount="pagPagerCount"
        @currentChange="onCurrentChange" @pageSizeChange="onPageSizeChange" class="page-main__pag")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { MsgBoxContent, Button } from '@/models'
import { newsMapper } from '../module/store'
import sleep from '@/mixins/sleep'
import ButtonApp from '@/components/ButtonApp.vue'
import MessageBox from '@/components/MessageBox.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import MsgBoxTools from '../mixins/MsgBoxTools'
import animateIfVisible from '@/mixins/animateIfVisible'
import { authMapper } from '@/modules/auth/module/store'
import { News } from '../models'
import ListNews from '../components/ListNews.vue'
import PaginationApp from '@/components/PaginationApp.vue'
import { uiMapper } from '@/services/store/modules/ui/store'

const NewsMappers = Vue.extend({
  computed: {
    ...newsMapper.mapGetters(['listSorted'])
  }
})
const UiMappers = Vue.extend({
  computed: {
    ...uiMapper.mapState(['breakpoint'])
  }
})
const AuthMappers = Vue.extend({
  computed: {
    ...authMapper.mapGetters(['activeMenuSectionByLink'])
  }
})

@Component({
  components: {
    MessageBox,
    ButtonApp,
    ListNews,
    PaginationApp
  },
  mixins: [
    MsgBoxTools
  ]
})

export default class PageMain extends Mixins(MsgBoxTools, MsgBoxToolsApp, AuthMappers, NewsMappers, UiMappers) {
  pageSize: number = 10
  currentPage: number = 1

  get isXs() { return this.breakpoint === 'xs' }
  get link() { return this.$route && this.$route.matched && this.$route.matched[0].path.slice(1) }
  get activeSection() { return this.link && this.activeMenuSectionByLink(this.link) }
  // list getters
  get pagesAmount() { return this.listSorted && this.listSorted.length / this.pageSize }
  get listByPages() {
    if (!this.listSorted) return

    const arr = []
    for (let i = 0; i < this.pagesAmount; i ++) {
      const start = i * this.pageSize
      const end = start + this.pageSize
      const part = this.listSorted.slice(start, end)
      arr.push(part)
    }

    return arr
  }
  get currentList() { return this.listByPages && this.listByPages[this.currentPage - 1] }
  get pagPagerCount() { return this.isXs ? 5 : 7 }

  // PAGINATION click handlers
  onCurrentChange(n) {
    this.currentPage = n
  }
  onPageSizeChange(n) {
    this.pageSize = n
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-main

  &__container
    display flex
    flex-direction column

  &__title
    order -1

  &__list
    +lt-md()
      order 1

  &__pag
    +gt-md()
      margin-top 50px
    +lt-md()
      order 0
      margin-bottom 35px
</style>
