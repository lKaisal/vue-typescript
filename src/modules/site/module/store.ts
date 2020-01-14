export default {
  namespaced: true,
  state: {
    name: 'site',
  },
  getters: {},
  mutations: {},
  actions: {
    initialize ({ dispatch }) {
      console.info('Site initializing...')
      console.info('Site initialized.')
    },
  }
}
