import PageBanners from '../pages/PageMain.vue'
import PageCreate from '../pages/PageCreate.vue'
import PageEdit from '../pages/PageEdit.vue'

export default [
  { path: '/banners/list', component: PageBanners, name: 'PageMain' },
  { path: '/banners/create', component: PageCreate, name: 'PageCreate' },
  { path: '/banners/edit/:id', component: PageEdit, name: 'PageEdit' },
  { path: '/banners', redirect: '/banners/list' },
  { path: '/banners/*', redirect: '/banners/list' }
]
