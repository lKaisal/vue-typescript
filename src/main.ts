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
import banners from './modules/banners/module'
import sections from './modules/sections/module'

// Vue.use(BootstrapVue)
Vue.use(ElementUI)

const ModuleBanners = () => import(/* webpackChunkName: 'banners' */ './pages/ModuleBanners.vue');

/* Initialize System Module */
Store.registerModule('system', system.store)
Router.addRoutes(system.routes)

Store.dispatch('system/initializeModule', banners)
Store.dispatch('system/initializeModule', sections)

// Vue.config.errorHandler = function(err, vm, info) {
//   console.log(`Error: ${err.toString()}\nInfo: ${info}`);
// }

// Vue.config.warnHandler = function(msg, vm, trace) {
//   console.log(`Warn: ${msg}\nTrace: ${trace}`);
// }

new Vue({
  template: '<App/>',
  router: Router,
  store: Store,
  render: h => h(App)
}).$mount('#app')
