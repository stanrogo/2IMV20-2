import Vue from 'vue'
import Router from 'vue-router'
import GlobalYear from '../components/GlobalYear'
import RegionStatistics from '../components/RegionStatistics'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: GlobalYear
    },
    {
      path: '/regions/:name',
      name: 'Region',
      component: RegionStatistics
    }
  ]
})
