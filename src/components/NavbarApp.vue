<template lang="pug">
  include ../tools/bemto.pug

  +b.navbar-app
    el-menu(class="navbar-app__el-menu" mode="horizontal")
      el-menu-item(v-for="(item, index) in menuItems" :key="index" :index="index + 1" v-html="item.name" @click="handleClick(item.link)" class="navbar-app__el-item")
        //- +e.ROUTER-LINK.link(:to="item.link" v-html="item.name")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
  }
})

export default class App extends Vue {
  menuItems = [{ name: 'Banners', link: '/banners' }, { name: 'Modules Demo', link: '/modules' }]

  handleClick(link: string) {
     this.$router.push({path: link}).catch(err => {})
  }
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
