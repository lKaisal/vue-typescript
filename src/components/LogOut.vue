<template lang="pug">
  include ../tools/bemto.pug

  +b.log-out
    +e.container(@click="logOut")
      IconSvg(icon="logout" class="log-out__icon")
      +e.text Выйти
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import IconSvg from '@/components/IconSvg.vue'
import LocalStorageService from '@/services/LocalStorageService'

@Component({
  components: {
    IconSvg,
  }
})

export default class LogOut extends Vue {
  logOut() {
    LocalStorageService.clearToken()
    this.$router.push({ name: 'PageAuth' })
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/tools'

.log-out

  &__container
    padding 10px
    margin -10px
    display flex
    align-items center
    cursor pointer
    &:hover
      opacity .75

  &__text
    font-size 14px

  &__icon
    margin-right 5px
    width 15px
    height 15px
    fill $cRegularText
</style>
