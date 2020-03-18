import Vue from 'vue'
import VueRouter from 'vue-router'
import LocalStorageService from '@/services/LocalStorageService'
import PageAuth from '@/modules/auth/pages/PageMain.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'App' },
    { path: '/auth', component: () => import(/* webpackChunkName: 'auth' */ '@/pages/ModuleAuth.vue'), redirect: { name: 'PageAuth' },
      children: [
        { path: '/', name: 'PageAuth', component: PageAuth },
        { path: '*', redirect: { name: 'PageAuth' } }
      ] },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path !== '/auth' && !LocalStorageService.getIsAuthorized()) next({ path: '/auth' })
  else if (LocalStorageService.getIsAuthorized() && !to.name) next('/')
  else next()
})

export default router
