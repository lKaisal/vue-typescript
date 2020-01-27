import Vue from 'vue'
import Router from './services/router'
import Store from './services/store'
import App from './App.vue'
import system from './modules/system/module'
// import BootstrapVue from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ModuleA from './modules/moduleA/ModuleA.vue'
import banners from './modules/banners/module'
import { createStore } from 'vuex-smart-module'
// import BannersStore from './modules/banners/module/store'

// Vue.use(BootstrapVue)
Vue.use(ElementUI)

const ModuleBanners = () => import(/* webpackChunkName: 'banners' */ './modules/banners/ModuleBanners.vue');

/* Initialize System Module */
Store.registerModule('system', system.store)
Router.addRoutes(system.routes)

Store.dispatch('system/initializeModule', banners)

new Vue({
  template: '<App/>',
  router: Router,
  store: Store,
  render: h => h(App)
}).$mount('#app')
