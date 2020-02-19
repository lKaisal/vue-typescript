import PageBanners from '../pages/PageMain.vue'
import PageCreate from '../pages/PageCreate.vue'
import PageEdit from '../pages/PageEdit.vue'
import ModuleBanners from '../../../pages/ModuleBanners.vue'

const children = [
  { path: 'list', component: PageBanners, name: 'PageBanners' },
  { path: 'create', component: PageCreate, name: 'PageCreate' },
  { path: 'edit', redirect: { name: 'PageBanners' } },
  { path: 'edit/:id', component: PageEdit, name: 'PageEdit' },
  { path: '*', redirect: { name: 'PageBanners' } },
]
export default [
  { path: '/banners', component: ModuleBanners, name: 'ModuleBanners', redirect: { name: 'PageBanners' }, children },
  { path: '/', component: ModuleBanners, name: 'ModuleBanners', redirect: { name: 'PageBanners' }, children },
]
