import ModuleSuppliersLogin from '../../../pages/ModuleSuppliersLogin.vue'
import PageSuplliersLogin from '../pages/PageMain.vue'

const children = [
  { path: '/', component: PageSuplliersLogin, name: 'PageSuplliersLogin'},
  { path: '*', redirect: { name: 'PageSuplliersLogin' } }
]
export default [
  { 
    path: '/suppliers-login', component: () => import(/* webpackChunkName: 'suppliers-login' */ '@/pages/ModuleSuppliersLogin.vue'), name: 'ModuleSuppliersLogin', redirect: { name: 'PageSuplliersLogin' },
    children, 
    meta: { title: 'Визитки поставщиков', isDynamicModule: true }
  },
]
