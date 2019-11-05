<template>
  <v-app>
    <v-app-bar app>
      <v-btn icon class="hidden-xs-only" v-if="$route.name !== 'Home'" v-on:click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>Immigration in the UK</v-toolbar-title>
    </v-app-bar>
    <v-content>
      <v-container fluid grid-list-md>
        <transition name="fade" mode="out-in">
          <router-view/>
        </transition>
        <range-slider/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

  import RangeSlider from "./components/RangeSlider";

  import ParseCSV from "./parseCSV";
  import inflow from './assets/datasets/world_migration_reasons.csv';
  import outflow from './assets/datasets/world_migration_outflow.csv';

  export default {
    components: {RangeSlider},
    name: 'app',
    created() {

      // On app creation, parse the necessary CSV files to make them available
      // throughout the application

      ParseCSV.parseCSV(inflow).then(({headers, data}) => {
        this.$store.state.inflowData = data;
        this.$store.state.dataHeaders = headers;
      });

      ParseCSV.parseCSV(outflow).then(({headers, data}) => {
        this.$store.state.outflowData = data;
      });
    }
  }
</script>
