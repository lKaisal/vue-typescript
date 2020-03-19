import ModuleSuppliers from '../../../pages/ModuleSuppliers.vue'
import PageSuplliersLogin from '../pages/PageMain.vue'

const children = [
  { path: '/', component: PageSuplliersLogin, name: 'PageSuplliersLogin'},
  { path: '*', redirect: { name: 'PageSuplliersLogin' } }
]
export default [
  { 
    path: '/suppliers-login', component: () => import(/* webpackChunkName: 'suppliers-login' */ '@/pages/ModuleSuppliers.vue'), name: 'ModuleSuppliers', redirect: { name: 'PageSuplliersLogin' },
    children, 
    meta: { title: 'Визитки поставщиков', isDynamicModule: true }
  },
]
