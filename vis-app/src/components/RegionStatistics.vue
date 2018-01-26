<template>
    <v-card>
      <h1>{{immigrationTotal}} million {{regionName}} entered the UK in {{this.year}}</h1>
      <h2>Where exactly did they come from and what are they here for?</h2>
      <svg id="D3Container"></svg>
    </v-card>
</template>

<script>

  import ParseCSV from "../parseCSV";
  import admissionsTotal from '../assets/datasets/admissions_total.csv';
  import refusedTotal from '../assets/datasets/refused_by_country.csv';

  export default {
    name: "region-statistics",
    data () {
      return {
        nodes: [],
        regionName: this.$route.params.name,
        immigrationTotal: 0,
      }
    },
    methods: {
      computeImmigrationTotal(){
        ParseCSV.parseCSV(admissionsTotal).then(({headers, data}) => {

          let regionTotal = 0;

          for (let i = this.startIndex; i < this.endIndex; i++) {

            regionTotal += Number(parseFloat(data[i][this.selectedRegion + 2]).toFixed(2));
          }

          this.immigrationTotal = regionTotal;
        });
      },
    },
    computed: {
      regions: function () {
        return this.$store.state.availableRegions;
      },
      selectedRegion: function(){
        return this.$store.state.selectedRegion;
      },
      startIndex: function () {
        return this.$store.state.startIndex;
      },
      endIndex: function () {
        return this.$store.state.endIndex;
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
      this.$store.commit('set_region', this.regionName);
      this.computeImmigrationTotal();

      this.$store.watch(
        (state) => state.timeChanged,
        () => this.computeImmigrationTotal()
      );
    }
  }
</script>

<style scoped>

</style>
