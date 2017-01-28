import Vue from 'vue'
import Electron from 'vue-electron'
import Resource from 'vue-resource'
import Router from 'vue-router'

import TryGet from './plugins/try-get'

Vue.use(Electron)
Vue.use(Resource)
Vue.use(Router)
Vue.use(TryGet)
Vue.config.debug = true

import App from './app'
import routes from './routes'

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  ...App
}).$mount('#app')
