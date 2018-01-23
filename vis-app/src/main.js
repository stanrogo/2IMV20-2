import Vue from 'vue'
import App from './App.vue'
import VueD3 from 'vue-d3'
import Vuetify from 'vuetify'

require('../node_modules/vuetify/dist/vuetify.min.css');

Vue.use(Vuetify);
Vue.use(VueD3);

new Vue({
  el: '#app',
  render: h => h(App)
});
