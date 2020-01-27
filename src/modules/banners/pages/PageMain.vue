<template lang="pug">
  include ../../../tools/bemto.pug

  +b.page-main.page
    +e.container
      +e.title.H1.page-title Список баннеров
      el-button.page-main__btn(type="primary" @click="onClick") Создать баннер
      ListBanners(class="page-main__list")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
import ListBanners from '../components/ListBanners.vue'
import PageCreate from './PageCreate.vue'

@Component({
  components: {
    ListBanners,
  }
})

export default class PageMain extends Vue {
  onClick() { this.$router.push({ name: 'PageCreate' }) }
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
