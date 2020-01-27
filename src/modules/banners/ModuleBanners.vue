<template lang="pug">
  include ../../tools/bemto.pug

  +b.module-banners
    +e.container.container
      //- PageMain(v-if="isPageHome")
      transition
        MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" :loading="msgBoxIsLoading" @close="closeMsgBox" @reset="loadData" class="module-banners__msg-box modal")
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
// import Store from './module/store'
import { MsgBoxContent, Banner } from './models'
import { bannersMapper } from '../banners/module/store'
import msgBoxTools from './mixins/msgBoxTools'
import PageMain from './pages/PageMain.vue'
import MessageBox from './components/MessageBox.vue'

const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapGetters(['listSorted'])
  },
  methods: {
    ...bannersMapper.mapActions(['getList'])
  }
})

@Component({
  components: {
    MessageBox,
    PageMain
  },
  mixins: [
    msgBoxTools
  ]
})

export default class ModuleBanners extends Mixins(Mappers, msgBoxTools) {
  msgBoxContent: MsgBoxContent = {
    title: 'Сервер не отвечает',
    msg: 'Произошла ошибка при загрузке данных',
    loadBtn: 'Загрузить повторно'
  }
  get list() { return this.listSorted }
  get isPageHome() { return this.$route.fullPath === '/banners' }

  async created() {
    if (!this.list || !this.list.length) this.loadData()
  }

  async loadData() {
    this.msgBoxIsLoading = true
    await this.getList()
      .then(() => console.log('List loaded!'))
      .catch(async (error) => {
        console.log(error)
        this.onErrorCatch()
      })
  }
}
</script>

<style lang="stylus">
@import '../../styles/app'
@import '../../styles/tools'

.module-banners

  &__container
    min-height 100%
    // min-height 100vh
    display flex
    width-between-property 'padding-top' 600 10 1000 20 true true
    width-between-property 'padding-top' 1441 20 1920 30 false true
    width-between-property 'padding-bottom' 600 10 1000 20 true true
    width-between-property 'padding-bottom' 1441 20 1920 30 false true

  &__page
    &.page-create
      width 100%
      align-self center
</style>
