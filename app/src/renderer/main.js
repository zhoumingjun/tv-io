import Vue from 'vue'
import Electron from 'vue-electron'
import Router from 'vue-router'

import App from './App'
import routes from './routes'
import store from './vuex/store'

Vue.use(Electron)
Vue.use(Router)

Vue.config.debug = true

const router = new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes
})

/* eslint-disable no-new */
new Vue({
  store,
  router,
  ...App
}).$mount('#app')
