<template lang="pug">
  include ./tools/bemto.pug

  +b.container
    <div>
      <h2>Module Main</h2>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/contact">Contact</router-link></li>
        <li><router-link to="/faq">FAQ</router-link></li>
      </ul>
    </div>
    <div v-if="moduleALoaded">
      <h2>Module A</h2>
      <ul>
        <li><router-link to="/trees">Trees</router-link></li>
        <li><router-link to="/colors">Colors</router-link></li>
        <li><router-link to="/buildings">Buildings</router-link></li>
      </ul>
    </div>
    <button @click="loadModuleA" :disabled="moduleALoaded">Load Module A</button>
    <button @click="deleteModuleA" :disabled="!moduleALoaded">Delete Module A</button>
    <div>
      <h3>-------------</h3>
      <router-view></router-view>
    </div>
</template>

<script>
import moduleA from './modules/moduleA/module'

export default {
  name: 'app',
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
}
</script>

<style lang="stylus">
@import '~@/styles/tools'

.container

  ul
    display flex
    li
      &:not(:last-child)
        margin-right 40px
      a
        color black
        text-decoration none
</style>