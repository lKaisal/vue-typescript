import ModuleRestart from '../../../pages/ModuleRestart.vue'
import PageRestart from '../pages/PageMain.vue'

const children = [
  { path: '/', component: PageRestart, name: 'PageRestart'},
  { path: '*', redirect: { name: 'PageRestart' } }
]
export default [
  { path: '/restart', component: ModuleRestart, name: 'ModuleRestart', redirect: { name: 'PageRestart' }, children, meta: { title: 'Рестарт сервисов', isDynamicModule: true }  },
]
