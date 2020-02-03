<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page(v-loading="isLoading")
    +e.container
      +e.title.H1.page-title Список баннеров
      el-button.page-main__btn(type="primary" @click="onCreateClick") Создать баннер
      ListBanners(:key="listSorted && listSorted.length" @deleteItem="onDeleteClick" class="page-main__list")
    transition
      MessageBox(v-show="msgBoxIsShown" :content="msgBoxContent" @close="closeMsgBox" @firstBtnClicked="onFirstBtnClick" @secondBtnClicked="closeMsgBox" :secondBtn="secondBtn" class="app__msg-box modal")
</template>

<script lang="ts">
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { MsgBoxContent, Button } from '../models'
import ListBanners from '../components/ListBanners.vue'
import MessageBox from '../components/MessageBox.vue'
import msgBoxTools from '../mixins/msgBoxTools'
import sleep from '@/mixins/sleep'
import { bannersMapper } from '../module/store'


const Mappers = Vue.extend({
  computed: {
    ...bannersMapper.mapState(['isLoading']),
    ...bannersMapper.mapGetters(['listSorted'])
  },
  methods: {
    ...bannersMapper.mapActions(['getList', 'deleteBanner'])
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
  deleteId: number = null
  secondBtn: Button = null

  created() {
    this.updateList()
  }

  onCreateClick() { this.$router.push({ path: '/banners/create' }) }
  onDeleteClick(id) {
    // store id here in case of repeated request
    if (id) this.deleteId = id

    this.secondBtn = { type: 'danger', isPlain: true }
    this.requestStatus = 'beforeDelete'
    this.openMsgBox()
  }
  onFirstBtnClick() {
    switch (this.requestStatus) {
      case 'beforeDelete':
        this.deleteItem()
      case 'failFetchList':
        this.updateList()
      default:
        this.closeMsgBox()
    }
  }
  deleteItem() {
    this.deleteBanner(this.deleteId)
      .then(async() => {
        this.secondBtn = { type: 'success', isPlain: true }
        this.requestStatus = 'successDelete'
        this.openMsgBox()
        this.deleteId = null
        this.updateList()
        await sleep(1500)
        this.closeMsgBox()
      })
      .catch(() => {
        this.secondBtn = { type: 'danger', isPlain: true }
        this.requestStatus = 'failDelete'
        this.openMsgBox()
        this.updateList()
      })
  }
  updateList() {
    // this.$emit('updateList')
    this.getList()
      .then(() => {
        console.log('List loaded!')
        this.closeMsgBox()
      })
      .catch(async (error) => {
        this.openMsgBox()
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
