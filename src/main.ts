import Vue from 'vue'
import Router from './services/router'
import Store from './services/store'
import App from './App.vue'
import system from './modules/system/module'
import siteModule from './modules/site/module'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(BootstrapVue)
Vue.use(ElementUI)

/* Initialize System Module */
Store.registerModule('system', system.store)
Router.addRoutes(system.routes)
Store.dispatch('system/initializeModule', siteModule)


Vue.config.productionTip = false

new Vue({
  template: '<App/>',
  router: Router,
  store: Store,
  render: h => h(App)
}).$mount('#app')
