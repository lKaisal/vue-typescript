import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'
import LocalStorageService from '@/services/LocalStorageService'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'App' },
    // { path: '*', redirect: { name: 'App' } }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'PageAuth' && !LocalStorageService.getIsAuthorized()) next({ path: '/auth/' })
  else if (LocalStorageService.getIsAuthorized() && !to.name) next('/')
  else next()
})

export default router
