import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Buefy from 'buefy'
import './assets/scss/app.scss'
import store from './store'

Vue.use(Buefy)

Vue.config.productionTip = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
