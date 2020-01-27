import PageBanners from '../pages/PageMain.vue'
import PageCreate from '../pages/PageCreate.vue'
import ModuleBanners from '../ModuleBanners.vue'

export default [
  { path: '/banners', component: ModuleBanners, name: 'ModuleBanners' },
  { path: '/banners/list', component: PageBanners, name: 'PageBanners' },
  { path: '/banners/create', component: PageCreate, name: 'PageCreate' },
  // { path: "*", component: PageMain, name: 'Error Page' }
]
