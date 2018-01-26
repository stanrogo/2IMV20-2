<template>
    <v-card>
      <h1>Total = {{totalImmigration}}</h1>
      <svg id="D3Container"></svg>
    </v-card>
</template>

<script>

  import RegionStatisticsD3 from '../regionStatisticsD3';

  export default {
    name: "region-statistics",
    data: function(){
      return {
        totalImmigration: 0
      }
    },
    methods: {
      updateDisplay() {
        this.globalStatisticsD3.year = this.year;
        this.globalStatisticsD3.quarter = this.quarter;
        this.totalImmigration = this.globalStatisticsD3._getTotalImmigration();
      }
    },
    computed: {
      totalImmigration: function(){
        return 0;
      },
      year: function () {
        return parseInt(this.$store.state.year);
      },
      quarter: function () {
        if(!this.$store.state.quarterActive){
          return null;
        }
        return (Number((this.$store.state.year % 1).toFixed(2)) + 0.25) * 4;
      },
    },
    created() {
      this.$store.watch(
        () => this.$store.state.year,
        () => this.updateDisplay()
      );
      this.$store.watch(
        () => this.$store.state.quarterActive,
        () => this.updateDisplay()
      );
    },
    mounted() {
      this.globalStatisticsD3 = new RegionStatisticsD3(this.$d3, 'EEA Nationals');
      this.updateDisplay();
    }
  }
</script>

<style scoped>

</style>
