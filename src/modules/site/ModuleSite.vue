<template lang="pug">
  include ../../tools/bemto.pug

  +b.module
    <h2>Module Main</h2>
    el-menu(mode="horizontal" :default-acctive="1")
      el-menu-item(v-for="(item, index) in mainItems" :index="index + 1")
        +e.ROUTER-LINK(:to="item.link" v-html="item.name")
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ModuleSite',
  data: () => ({
    mainItems: [{ name: 'Home', link: '/' }, { name: 'Contact', link: '/contact' }, { name: 'FAQ', link: '/faq' }],
  }),
})
</script>