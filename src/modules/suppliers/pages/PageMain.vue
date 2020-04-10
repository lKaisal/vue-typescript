<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page(v-loading.fullscreen.lock="isLoading")
    +e.container(v-if="list.data && list.data.length && !list.isLoading")
      +e.title.H1.page-title(v-html="activeSection && activeSection.title")
      SearchApp(:list="listSorted" :fields="searchFields" :uniqueFieldIndex="2" @searchProgress="handleSearchProgress"
        @searchFinished="handleSearchFinished" class="page-main__search")
      //- FilterSuppliers(class="page-main__filter")
      transition(mode="out-in")
        ListSuppliers(:list="currentList" @itemClicked="goToPageSupplier" class="page-main__list")
      ButtonApp(btnType="primary" :isPlain="true" text="Обновить список" @clicked="emitLoadList" class="page-main__btn")
      PaginationApp(:total="listSorted && listSorted.length" :pageSize="pageSize" :pagerCount="pagPagerCount" @currentChange="onCurrentChange" @pageSizeChange="onPageSizeChange"
        class="page-main__pag")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { MsgBoxContent, Button, SearchField, FilterItem } from '@/models'
import { uiMapper } from '@/modules/ui/module/store'
import { authMapper } from '@/modules/auth/module/store'
import ButtonApp from '@/components/ButtonApp.vue'
import MessageBox from '@/components/MessageBox.vue'
import PaginationApp from '@/components/PaginationApp.vue'
import MsgBoxToolsApp from '@/mixins/MsgBoxToolsApp'
import animateIfVisible from '@/mixins/animateIfVisible'
import sleep from '@/mixins/sleep'
import SearchApp from '@/components/SearchApp.vue'
import FilterSuppliers from '../components/filter/FilterSuppliers.vue'
import { suppliersMapper } from '../module/store'
import { EditPayload, Supplier } from '../models'
import ListSuppliers from '../components/ListSuppliers.vue'
import CardSupplier from '../components/CardSupplier.vue'
import MsgBoxTools from '../mixins/MsgBoxTools'

const UiMappers = Vue.extend({
  computed: {
    ...uiMapper.mapState(['breakpoint'])
  }
})
const SuppliersMappers = Vue.extend({
  computed: {
    ...suppliersMapper.mapState(['list', 'listFiltered']),
    ...suppliersMapper.mapGetters(['isLoading', 'listSorted', 'listSortedAndFiltered'])
  },
  methods: {
    ...suppliersMapper.mapMutations(['setListSearched']),
    ...suppliersMapper.mapActions(['editPhone'])
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
    ListSuppliers,
    PaginationApp,
    CardSupplier,
    SearchApp,
    FilterSuppliers
  },
  mixins: [
    MsgBoxTools
  ],
})

export default class PageMain extends Mixins(MsgBoxTools, MsgBoxToolsApp, UiMappers, SuppliersMappers, AuthMappers) {
  pageSize: number = 10
  currentPage: number = 1
  searchFields: SearchField[] = [
    { field: 'supplierId', title: 'SupplierId' },
    { field: 'supplierName', title: 'Название поставщика' },
    { field: 'userId', title: 'UserId' },
    { field: 'userName', title: 'Имя пользователя' },
    { field: 'inn', title: 'ИНН' },
    { field: 'phone', title: 'Номер телефона' },
  ]
  phoneManageIsShown: boolean = false
  secondBtn: Button = null

  get isXs() { return this.breakpoint === 'xs' }
  get fetchListFailed() { return this.requestStatus === 'failFetchList' }
  get moduleLink() { return this.$route && this.$route.matched && this.$route.matched[0].path.slice(1) }
  get activeSection() { return this.moduleLink && this.activeMenuSectionByLink(this.moduleLink) }
  // LIST GETTERS
  get pagesAmount() { return this.listSortedAndFiltered && this.listSortedAndFiltered.length / this.pageSize }
  get listByPages() {
    if (!this.listSortedAndFiltered) return

    const arr = []
    for (let i = 0; i < this.pagesAmount; i ++) {
      const start = i * this.pageSize
      const end = start + this.pageSize
      const part = this.listSortedAndFiltered.slice(start, end)
      arr.push(part)
    }

    return arr
  }
  get currentList() { return this.listByPages && this.listByPages[this.currentPage - 1] }
  get pagPagerCount() { return this.isXs ? 5 : 7 }

  created() {
    this.emitLoadList(true)
  }

  emitLoadList(loadingIsShown: boolean) {
    this.$emit('loadList', loadingIsShown)
  }
  // SEARCH handlers
  handleSearchProgress(res) {
    this.setListSearched(res)
  }
  handleSearchFinished() {
    this.setListSearched(null)
  }
  // PAGINATION click handlers
  onCurrentChange(n) {
    this.currentPage = n
  }
  onPageSizeChange(n) {
    this.pageSize = n
  }
  // LIST click handlers
  goToPageSupplier(userId) {
    this.$router.push({ path: `/${this.moduleLink}/user/${userId}` }).catch(() => {})
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

  &__search
    +gt-md()
      margin-bottom 20px
    +lt-md()
      order 0
      margin-bottom 30px

  &__list
    // grid-size(4, 4, 6, 8, 10)
    // margin 0 auto
    +gt-md()
      margin-bottom 20px
    +lt-md()
      order 2
    transition(opacity)
    &.v-enter
    &.v-leave-to
      opacity 0

  &__pag
    +lt-md()
      order 1
      margin-bottom 15px

  &__btn
    +gt-md()
      margin-bottom 50px
    +lt-md()
      order 5
      margin-top 35px
</style>
