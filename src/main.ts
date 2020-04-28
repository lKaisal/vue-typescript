import Vue from 'vue'
import Router from './services/router'
import Store from './services/store/store'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueMeta from 'vue-meta'
import news from '@/modules/news/module'

//Import Froala Editor 
import 'froala-editor/js/plugins.pkgd.min.js';
// //Import third party plugins
// import 'froala-editor/js/third_party/embedly.min';
// import 'froala-editor/js/third_party/font_awesome.min';
// import 'froala-editor/js/third_party/spell_checker.min';
// import 'froala-editor/js/third_party/image_tui.min';
// // Import Froala Editor css files.
import 'froala-editor/css/froala_editor.pkgd.min.css';
require('froala-editor/js/languages/ru')
// import VueFroala from 'vue-froala-wysiwyg'
// import 'froala-editor/js/plugins/align.min.js'

// Vue.use(VueFroala)
Vue.use(ElementUI)
Vue.use(VueMeta)
Vue.config.productionTip = false

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
