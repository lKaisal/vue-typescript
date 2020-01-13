import Vue from 'vue'
import Router from './services/router'
import Store from './services/store'
import App from './App.vue'
import system from './modules/system/module'
import siteModule from './modules/site/module'
import moduleA from './modules/moduleA/module'

/* Initialize System Module */
Store.registerModule('system', system.store)
Router.addRoutes(system.routes)
Store.dispatch('system/initializeModule', siteModule)
Store.dispatch('system/initializeModule', moduleA)

new Vue({ // eslint-disable-line no-new
	el: '#app',
	template: '<App/>',
	router: Router,
	store: Store,
	render: h => h(App)
})
