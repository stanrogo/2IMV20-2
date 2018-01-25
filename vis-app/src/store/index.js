import Vue from "vue";
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    year: 2007,
    quarterActive: false
  },
  mutations: {
    change_year (state, payLoad) {
      state.year = payLoad;
    },
    set_quarter_active (state, payLoad) {
      state.quarterActive = payLoad;
    }
  }
});

export default store;
