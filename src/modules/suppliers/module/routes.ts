import ModuleSuppliers from '../../../pages/ModuleSuppliers.vue'
import PageSuppliers from '../pages/PageMain.vue'

const children = [
  { path: '/', component: PageSuppliers, name: 'PageSuppliers'},
  { path: '*', redirect: { name: 'PageSuppliers' } }
]
export default [
  { 
    path: '/suppliers-login', component: () => import(/* webpackChunkName: 'suppliers-login' */ '@/pages/ModuleSuppliers.vue'), name: 'ModuleSuppliers', redirect: { name: 'PageSuppliers' },
    children, 
    meta: { title: 'Визитки поставщиков', isDynamicModule: true }
  },
]
