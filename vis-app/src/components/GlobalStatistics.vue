<template>
  <v-card>
    <svg id="D3Container" width="100%" height="500">
      <g v-for="(d, i) in nodes" :transform="'translate(' + d.x + ',' + d.y + ')'">
        <circle :r="d.r" fill="#4DA6FF" v-on:click="goToRegion(d.name)"></circle>
        <text text-anchor="middle">{{d.label}}</text>
      </g>
    </svg>
  </v-card>
</template>

<script>
  import ParseCSV from "../parseCSV";
  import admissionsTotal from '../assets/datasets/admissions_total.csv';

  export default {
    data () {
      return {
        nodes: []
      }
    },
    methods: {
      updateDisplay() {

        ParseCSV.parseCSV(admissionsTotal).then(({headers, data}) => {

          this.getData(data);
        });
      },
      getData(data){

        // There are 4 regions available in total, each with their own name and total immigration figures

        const regionTotals = [];
        const nodes = [];

        this.regions.forEach(region => regionTotals.push({name: region, total: 0}));

        for (let i = this.startIndex; i < this.endIndex; i++) {

          regionTotals.forEach((region, j) => region.total += Number(parseFloat(data[i][j + 2]).toFixed(2)));
        }

        regionTotals.forEach((region, index) => {

          nodes.push({
            "x": 300 * index + 150,
            "y": 150,
            "r": region.total,
            "name": region.name,
            "label": region.name
          });
        });

        this.nodes = nodes;
      },
      goToRegion(regionName){
        this.$router.push('/regions/' + regionName);
      }
    },
    computed: {
      year: function () {
        return this.$store.state.year;
      },
      quarter: function () {
        return this.$store.state.quarter;
      },
      regions: function () {
        return this.$store.state.availableRegions;
      },
      startIndex: function () {
        return this.$store.state.startIndex;
      },
      endIndex: function () {
        return this.$store.state.endIndex;
      }
    },
    created() {
      this.$store.watch(
        (state) => state.timeChanged,
        () => this.updateDisplay()
      );
    },
    mounted() {
      this.updateDisplay();
    }
  }
</script>
