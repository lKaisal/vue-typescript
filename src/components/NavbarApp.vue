<template lang="pug">
  include ../tools/bemto.pug

  +b.navbar-app
    el-menu(class="navbar-app__el-menu" mode="horizontal")
      el-menu-item(v-for="(item, index) in menuItems" :key="index" :index="(index + 1).toString()" v-html="item.name" @click="handleClick(item.link)" :disabled="!getModuleLoaded(item.module)" class="navbar-app__el-item")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
  }
})

export default class App extends Vue {
  menuItems = [{ name: 'Banners', link: '/banners', module: 'banners' }, { name: 'Modules Demo', link: '/modules', module: 'site' }]

  handleClick(link: string) {
     this.$router.push({path: link}).catch(err => {})
  }
  getModuleLoaded(module: string) { return !!this.$store.state[module] }
}
</script>

<style lang="stylus" scoped>
@import '~@/styles/tools'

.navbar-app

  &__el-item
    position relative

  &__link
    display block
    box-sizing border-box
</style>
