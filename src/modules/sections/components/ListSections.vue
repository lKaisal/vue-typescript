<template lang="pug">
  include ../../../tools/bemto.pug

  +b.list-banners
    +e.container
      +e.row
        +e.item(v-for="(item, index) in list" v-html="item.name")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { sectionsMapper } from '../module/store'

const Mappers = Vue.extend({
  computed: {
    ...sectionsMapper.mapState(['list'])
  }
})

export default class ListBanners extends Vue {

}
</script>

<style lang="stylus" scoped>
@import '../../../styles/tools'

.list-banners
  //

</style>