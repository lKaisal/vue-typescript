import PageBanners from '../pages/PageMain.vue'
import PageCreate from '../pages/PageCreate.vue'
import PageEdit from '../pages/PageEdit.vue'
import ModuleBanners from '../../../pages/ModuleBanners.vue'

// export default [
//   // { path: '/banners/list', component: PageBanners, name: 'PageBanners' },
//   // { path: '/banners/create', component: PageCreate, name: 'PageCreate' },
//   // { path: '/banners/edit/:id', component: PageEdit, name: 'PageEdit' },
//   { path: '/banners/', component: ModuleBanners, redirect: {name: 'PageBanners'}, name: 'ModuleBanners'
//   , children: [
//     { path: 'list', component: PageBanners, name: 'PageBanners' },
//     { path: 'create', component: PageCreate, name: 'PageCreate' },
//     { path: 'edit/:id', component: PageEdit, name: 'PageEdit' },
//   ] },
//   // { path: '/banners/*', redirect: '/banners' }
// ]

const children = [
  { path: 'list', component: PageBanners, name: 'PageBanners' },
  { path: 'create', component: PageCreate, name: 'PageCreate' },
  { path: 'edit/:id', component: PageEdit, name: 'PageEdit' },
]
const routes = [
  { path: '/banners', component: ModuleBanners, name: 'ModuleBanners', redirect: { name: 'PageBanners' }, children },
  // { path: 'list', component: PageBanners, name: 'PageBanners' },
  // { path: 'create', component: PageCreate, name: 'PageCreate' },
  // { path: 'edit/:id', component: PageEdit, name: 'PageEdit' },
]

export { routes, children }
