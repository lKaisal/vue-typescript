import ModulePhones from '../../../pages/ModulePhones.vue'
import PagePhones from '../pages/PageMain.vue'

const children = [
  { path: '/', component: PagePhones, name: 'PagePhones'},
  { path: '*', redirect: { name: 'PagePhones' } }
]
export default [
  { 
    path: '/phones', component: () => import(/* webpackChunkName: 'phones' */ '@/pages/ModulePhones.vue'), name: 'ModulePhones', redirect: { name: 'PagePhones' },
    children, 
    meta: { title: 'Визитки поставщиков', isDynamicModule: true }
  },
]
