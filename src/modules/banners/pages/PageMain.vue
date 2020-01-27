<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page
    +e.container
      +e.title.H1.page-title Список баннеров
      el-button.page-main__btn(type="primary" @click="onClick") Создать баннер
      ListBanners(class="page-main__list")
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" :loading="msgBoxIsLoading" @close="closeMsgBox" @reset="loadData" class="module-banners__msg-box modal")
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
import { MsgBoxContent } from '../models'
import ListBanners from '../components/ListBanners.vue'
import MessageBox from '../components/MessageBox.vue'
import msgBoxTools from '../mixins/msgBoxTools'
import { bannersMapper } from '../module/store'

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
    ListBanners,
    MessageBox
  },
  mixins: [
    msgBoxTools
  ]
})

export default class PageMain extends Mixins(msgBoxTools, Mappers) {
  msgBoxContent: MsgBoxContent = {
    title: 'Сервер не отвечает',
    msg: 'Произошла ошибка при загрузке данных',
    loadBtn: 'Загрузить повторно'
  }
  get list() { return this.listSorted }

  async created() {
    if (!this.list || !this.list.length) this.loadData()
  }

  onClick() { this.$router.push({ path: '/banners/create' }) }

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

<style lang="stylus" scoped>
@import '../../../styles/tools'

.page-main

  &__container
    position relative

  &__btn
    margin-bottom 50px

  &__list
    width 100%
</style>
