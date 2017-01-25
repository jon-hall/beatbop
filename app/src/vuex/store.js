import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  actions,
  getters,
  modules,
  strict: true
})

if (module.hot) {
  module.hot.accept(['./actions', './getters', './modules'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
    const newActions = require('./actions').default
    const newGetters = require('./getters').default
    const newModules = require('./modules').default

    // swap in the new actions and mutations
    store.hotUpdate({
      actions: newActions,
      getters: newGetters,
      modules: newModules
    })
  })
}

export default store
