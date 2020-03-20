import ModuleSuppliers from '../../../pages/ModuleSuppliers.vue'
import PageSuppliers from '../pages/PageMain.vue'
import PageSupplier from '../pages/PageSupplier.vue'

const children = [
  { path: 'list', component: PageSuppliers, name: 'PageSuppliers'},
  // { path: 'user', redirect: {component: PageSuppliers}},
  { path: 'user/:userId', component: PageSupplier, name: 'PageSupplier'},
  { path: '*', redirect: { name: 'PageSuppliers' } }
]
export default [
  { 
    path: '/suppliers-login', component: () => import(/* webpackChunkName: 'suppliers-login' */ '@/pages/ModuleSuppliers.vue'), name: 'ModuleSuppliers', redirect: { name: 'PageSuppliers' },
    children, 
    meta: { title: 'Визитки поставщиков', isDynamicModule: true }
  },
]
