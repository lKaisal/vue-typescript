import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'
import PageAuth from '@/modules/auth/pages/PageMain.vue'
import LocalStorageService from '@/services/LocalStorageService'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: App, name: 'App' },
    { path: '*', redirect: { name: 'App' } }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(to, LocalStorageService.getIsAuthorized())
  if (to.name !== 'PageAuth' && !LocalStorageService.getIsAuthorized()) next({ path: '/auth' })
  else next()
})

export default router
