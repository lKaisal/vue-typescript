import ModuleAuth from '@/pages/ModuleAuth.vue'
import PageAuth from '../pages/PageMain.vue'

const children = [
]
export default [
  { path: '/auth', component: PageAuth, name: 'PageAuth' },
  { path: '/auth/*', redirect: { name: 'PageAuth' } },
]
