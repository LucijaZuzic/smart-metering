import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import 'bootstrap-vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

Vue.use(VueRouter)

import { BootstrapVue } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)

import 'vue-chartjs'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
