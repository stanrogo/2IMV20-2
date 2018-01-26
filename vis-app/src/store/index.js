import Vue from "vue";
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    fullYear: 2007.0,
    year: 2007,
    startIndex: 0,
    endIndex: 4,
    quarter: -1,
    quarterActive: false,
    timeChanged: 0,
    selectedRegion: -1,
    availableRegions: [
      'Non-EEA Nationals',
      'EEA Nationals',
      'British Citizens',
      'Other EEA and Swiss Nationals'
    ]
  },
  mutations: {
    change_year(state, payLoad = state.fullYear) {

      const quarter = state.quarterActive ? (Number((payLoad % 1).toFixed(2)) + 0.25) * 4 : -1;
      const year = parseInt(payLoad);

      // The first year is 2007 and has 4 quartiles

      let  startIndex = (year - 2007) * 4;

      if (quarter > -1) {

        startIndex += quarter - 1;
      }

      const endIndex = quarter > -1 ? startIndex + 1 : startIndex + 4;

      state.startIndex = startIndex;
      state.endIndex = endIndex;
      state.year = year;
      state.quarter = quarter;
      state.fullYear = payLoad;
      state.timeChanged = + new Date();
    },
    set_quarter_active(state, payLoad) {
      state.quarterActive = payLoad;
      store.commit('change_year');
    }
  }
});

export default store;
