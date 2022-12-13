import Vue from 'vue'
import App from './App.vue'

import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)

import HighchartsVue from 'highcharts-vue'

Vue.use(HighchartsVue)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
