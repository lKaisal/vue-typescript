<template lang="pug">
  include ../tools/bemto.pug

  +b.log-out
    +e.container(@click="logOut" :class=" { 'is-in-menu': isInMenu } ")
      IconSvg(v-if="!isInMenu" icon="logout" class="log-out__icon")
      +e.text Выйти
      IconSvg(v-if="isInMenu" icon="logout" class="log-out__icon log-out__icon_right")
</template>

<script lang="ts">
import { Vue, Component, Mixins, Watch, Prop } from 'vue-property-decorator'
import IconSvg from '@/components/IconSvg.vue'
import LocalStorageService from '@/services/LocalStorageService'
import Store from '@/services/store'
import { mapActions, mapGetters } from 'vuex'
import banners from '@/modules/banners/module'

@Component({
  components: {
    IconSvg,
  },
  computed: {
    ...mapGetters('system', [
      'modules'
    ])
  },
  methods: {
    ...mapActions('system', [
      'removeModule'
    ])
  }
})

export default class LogOut extends Vue {
  @Prop() isInMenu: boolean
  modules!: any[]
  removeModule!: (string) => void
  modulePath: string = './modules/'

  logOut() {
    // console.log(Store)
    // console.log(this.$store.unregisterModule('banners'))
    LocalStorageService.clearToken()
    for (const mod of this.modules.slice(0)) {
      // console.log(mod)
      // console.log(mod.name)
      // console.log(`@/modules/${mod.name}/module`)
      // const modNew = import (`@/modules/${mod.name}/module`)
      // console.log(modNew)
      this.removeModule(mod.name)
    }
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
    .is-in-menu &
      font-size 16px
      fontMedium()

  &__icon
    margin-right 5px
    width 15px
    height 15px
    fill $cRegularText
    &_right
      margin-right 0
      margin-left 10px
</style>
