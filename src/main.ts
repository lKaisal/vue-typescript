import Vue from 'vue'
import Router from './services/router'
import Store from './services/store'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import auth from './modules/auth/module'

Vue.use(ElementUI)

/* Initialize System Module */ // initialized by default 
// Store.registerModule('system', system.store)
// Router.addRoutes(system.routes)

/* Initialize Auth Module */
Store.dispatch('system/initializeModule', auth)

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
