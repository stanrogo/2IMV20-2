import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueD3 from 'vue-d3'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

Vue.use(VueD3);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
