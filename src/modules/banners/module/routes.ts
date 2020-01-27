import PageBanners from '../pages/PageMain.vue'
import PageCreate from '../pages/PageCreate.vue'
// import ModuleBanners from '../ModuleBanners.vue'

export default [
  { path: '/banners', component: PageBanners,
  },
  {path: '/banners/list', component: PageBanners},
  {path: '/banners/create', component: PageCreate}
]
