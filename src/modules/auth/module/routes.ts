// import ModuleAuth from '@/pages/ModuleAuth.vue'
import PageAuth from '../pages/PageMain.vue'

const children = [
  { path: '/', name: 'PageAuth', component: PageAuth },
  { path: '*', redirect: { name: 'PageAuth' } }
]
export default [
  { path: '/auth', component: () => import(/* webpackChunkName: 'auth' */ '@/pages/ModuleAuth.vue'), redirect: { name: 'PageAuth' }, children },
]
