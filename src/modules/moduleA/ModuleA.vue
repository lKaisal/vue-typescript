<template lang="pug">
  include ../../tools/bemto.pug

  +b.module
    <h2>Module A</h2>
    el-menu(mode="horizontal" :default-acctive="1")
      el-menu-item(v-for="(item, index) in aItems" :key="index" :index="(index + 1).toString()")
        +e.ROUTER-LINK(:to="item.link" v-html="item.name")
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ModuleA',
  data: () => ({
    aItems: [{ name: 'Banners', link: '/banners' }, { name: 'Suppliers', link: '/suppliers' }, { name: 'CRM', link: '/crm' }]
  }),
})
</script>