import Vue from 'vue'
import VueRouter from 'vue-router'
// import PageBanners from '@/pages/PageBanners.vue'
// import PageDemo from '@/pages/PageDemo.vue'
import PageBanners from '../modules/banners/pages/PageMain.vue'
import PageCreate from '../modules/banners/pages/PageCreate.vue'
import PageEdit from '../modules/banners/pages/PageEdit.vue'
import ModuleBanners from '../pages/ModuleBanners.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    // { path: '/banners/', component: ModuleBanners, name: 'ModuleBanners', children: [
    //   { path: 'list', component: PageBanners, name: 'PageBanners' },
    //   { path: 'create', component: PageCreate, name: 'PageCreate' },
    //   { path: 'edit/:id', component: PageEdit, name: 'PageEdit' },
    // ]},
  ]
})
