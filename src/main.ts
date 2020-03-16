import Vue from 'vue'
import Router from './services/router'
import Store from './services/store'
import App from './App.vue'
import system from './modules/system/module'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import banners from './modules/banners/module'
import features from './modules/features/module'
import auth from './modules/auth/module'
import restart from './modules/restart/module'
import suppliers from './modules/suppliers-login/module'
import LocalStorageService from '@/services/LocalStorageService'

Vue.use(ElementUI)

/* Initialize System Module */ // initialized by default 
// Store.registerModule('system', system.store)
// Router.addRoutes(system.routes)

/* Initialize Auth Module */
Store.dispatch('system/initializeModule', auth)

Store.dispatch('system/initializeModule', banners)
Store.dispatch('system/initializeModule', features)
Store.dispatch('system/initializeModule', restart)
Store.dispatch('system/initializeModule', suppliers)

// initialize modules
const menu = LocalStorageService.getMenu()
console.log(menu)

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
