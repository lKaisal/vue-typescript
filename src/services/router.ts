import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '@/App.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: App, name: 'App' },
    { path: '*', redirect: { name: 'App' } }
  ]
})
