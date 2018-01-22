import Vue from 'vue'
import App from './App.vue'
import VueD3 from 'vue-d3'

Vue.use(VueD3);

new Vue({
  el: '#app',
  render: h => h(App)
});
