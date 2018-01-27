import Vue from "vue";
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    year: 2007,
    timeChanged: 0,
    selectedRegion: '',
    regions: {
      'Rest of the World': [
        'Sub-Saharan Africa',
        'North Africa',
        'North America',
        'Central and South America',
        'Oceania',
        'Other Europe'
      ],
      'Asia':[
        'Middle East and Central Asia',
        'East Asia',
        'South Asia',
        'South East Asia'
      ],
      'European Union': [
        'European Union EU15',
        'European Union EU8',
        'European Union EU2',
        'European Union Other'
      ],
      'British (Including Overseas Territories)': []
    },
    currentTotalImmigration: 0,
    inflowData: [],
    outflowData: [],
    dataHeaders: []
  },
  mutations: {
    change_year(state, payLoad) {
      state.year = payLoad;
      state.timeChanged = + new Date();
    },
    set_region(state, payLoad){
      state.selectedRegion = payLoad;
    }
  }
});

export default store;
