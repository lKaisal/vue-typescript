import ModuleRestart from '../../../pages/ModuleRestart.vue'
import PageMain from '../pages/PageMain.vue'

const children = [
  { path: '/', component: PageMain, name: 'PageMain'},
  { path: '*', redirect: { name: 'PageMain' } }
]
export default [
  { path: '/restart', component: ModuleRestart, name: 'ModuleRestart', redirect: { name: 'PageMain' }, children, meta: { title: 'Рестарт сервисов' }  },
]
