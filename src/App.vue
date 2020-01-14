<template lang="pug">
  include ./tools/bemto.pug

  +b.container.container
    +e.modules
      +e.module
        <h2>Module Main</h2>
        el-menu(mode="horizontal")
          el-menu-item(v-for="(item, index) in mainItems" :index="index + 1")
            +e.ROUTER-LINK(:to="item.link" v-html="item.name")
          //- <li><router-link to="/contact">Contact</router-link></li>
          //- <li><router-link to="/faq">FAQ</router-link></li>
        </ul>
      +e.module(v-if="moduleALoaded")
        <h2>Module A</h2>
        el-menu(mode="horizontal")
          el-menu-item(v-for="(item, index) in aItems" :index="index + 1")
            +e.ROUTER-LINK(:to="item.link" v-html="item.name")
    <el-button type="primary" @click="loadModuleA" :disabled="moduleALoaded">Load Module A</el-button>
    <el-button type="primary" @click="deleteModuleA" :disabled="!moduleALoaded">Delete Module A</el-button>
    +e.page
      <router-view></router-view>
</template>

<script>
import moduleA from './modules/moduleA/module'
import Vue from 'vue'

export default Vue.extend({
  name: 'app',
  data: () => ({
    mainItems: [{ name: 'Home', link: '/' }, { name: 'Contact', link: '/contact' }, { name: 'FAQ', link: '/faq' }],
    aItems: [{ name: 'Banners', link: '/banners' }, { name: 'Suppliers', link: '/suppliers' }, { name: 'CRM', link: '/crm' }]
  }),
  computed: {
    moduleALoaded() { return !!this.$store.state.moduleA },
  },
  methods: {
    loadModuleA() {
      this.$store.dispatch('system/initializeModule', moduleA)
    },
    deleteModuleA() {
      this.$store.dispatch('system/removeModule', moduleA)
    }
  }
})
</script>

<style lang="stylus">
@import '~@/styles/tools'

.container
  padding-top 100px
  padding-bottom 100px

  &__modules
    display flex
    margin-bottom 50px

  &__module
    &:not(:last-child)
      margin-right 150px

  &__page
    margin-top 5vh
</style>
