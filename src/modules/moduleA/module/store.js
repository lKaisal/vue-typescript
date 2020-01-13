export default {
	namespaced: true,
	state: {
    name: 'moduleA',
  },
	getters: {},
	mutations: {},
	actions: {
		initialize ({ commit }) {
			console.info('ModuleA initializing...')
			console.info('ModuleA initialized.')
		}
	}
}
