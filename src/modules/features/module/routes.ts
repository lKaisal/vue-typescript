import ModuleFeatures from '../../../pages/ModuleFeatures.vue'
import PageMain from '../pages/PageMain.vue'

const children = [
  { path: '/', component: PageMain, name: 'PageMain' },
  { path: '*', redirect: { name: 'PageMain' } }
]
export default [
  { path: '/features', component: ModuleFeatures, name: 'ModuleFeatures', redirect: { name: 'PageMain' }, children, meta: { title: 'Вкл/откл разделов' } },
]
