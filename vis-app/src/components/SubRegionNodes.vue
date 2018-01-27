<template>
  <v-layout row wrap>
    <v-flex xs12 pb-0>
      <v-card dark color="secondary">
        <v-card-title>How does it look like on a per country basis?</v-card-title>
      </v-card>
    </v-flex>
    <v-flex xs12 pt-0>
      <v-card color="white">
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <svg id="D3Container" width="100%" height="500">
                <text v-for="(total, name, index) in regionTotals" :x="(33 * (index  % 3) + 10) + '%'"
                      :y="240 * Math.floor(index  / 3) + 240">{{name}}
                </text>
                <circle v-for="(total, name, index) in regionTotals" :cx="(33 * (index  % 3) + 15) + '%'"
                        :cy="240 * Math.floor(index  / 3) + 100"
                        :r="total/1.5" fill="#4DA6FF"></circle>
              </svg>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: "sub-region-nodes",
    data(){
      return{
        regionTotals: {}
      }
    },
    watch: {
      outflow: function () {
        this.updateDisplay();
      }
    },
    methods: {
      updateDisplay(){
        this.computeImmigrationPerRegion();
      },
      computeImmigrationPerRegion() {
        const data = this.outflow ? this.outflowData : this.inflowData;
        const subRegionNames = this.regions[this.selectedRegion];
        const regionTotals = {};
        const row = this.getFirstRow(data);

        subRegionNames.forEach((region) => {
          regionTotals[region] = parseInt(row[this.headers.indexOf(region)]);
        });

        this.regionTotals = regionTotals;
      },
      getFirstRow(data){

        let row = [];

        data.some((dataRow) => {

          if(dataRow[0].indexOf(`${this.year.toString().slice(-2)}`) !== -1){

            row = dataRow;
            return true;
          }
        });

        return row;
      }
    },
    computed: {
      regions: function () {
        return this.$store.state.regions;
      },
      outflow: function () {
        return this.$store.state.outflow;
      },
      selectedRegion: function () {
        return this.$store.state.selectedRegion;
      },
      headers: function () {
        return this.$store.state.dataHeaders;
      },
      year: function () {
        return this.$store.state.year;
      },
      inflowData(){
        return this.$store.state.inflowData.filter((row) => {
          if(row.length < 2) return false;
          return row[0].indexOf('Dec') !== -1;
        });
      },
      outflowData(){
        return this.$store.state.outflowData.filter((row) => {
          if(row.length < 2) return false;
          return row[0].indexOf('Dec') !== -1;
        });
      }
    },
    created(){
      this.updateDisplay();

      this.$store.watch(
        (state) => state.year,
        () => this.updateDisplay()
      );
    }
  }
</script>

<style scoped>

</style>
