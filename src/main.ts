import Vue from 'vue'
import Router from './services/router'
import Store from './services/store/store'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueMeta from 'vue-meta'
import news from '@/modules/news/module'

Vue.use(ElementUI)
Vue.use(VueMeta)

/* Initialize Root Module */ // initialized by default 
// Store.registerModule('ui', ui.store)
// Router.addRoutes(ui.routes)

/* Initialize News Module */
Store.dispatch('initializeModule', { module: news, path: 'news', title: 'Новости' })

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
