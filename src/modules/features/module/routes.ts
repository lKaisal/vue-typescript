import ModuleFeatures from '../../../pages/ModuleFeatures.vue'
import PageFeatures from '../pages/PageMain.vue'

const children = [
  { path: '/', component: PageFeatures, name: 'PageFeatures' },
  { path: '*', redirect: { name: 'PageFeatures' } }
]
export default [
  { path: '/features', component: () => import(/* webpackChunkName: 'features' */ '@/pages/ModuleFeatures.vue'), name: 'ModuleFeatures', redirect: { name: 'PageFeatures' }, children, meta: { title: 'Вкл/откл разделов', isDynamicModule: true } },
]
