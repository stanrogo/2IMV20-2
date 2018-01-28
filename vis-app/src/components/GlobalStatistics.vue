<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card dark color="primary">
        <v-card-title>
          <h1 class="headline">Immigration figures to the UK per year</h1>
        </v-card-title>
        <v-card-text>Click on a node to explore further</v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-card>
        <v-btn flat :color="showInflow && !showOutflow ? 'primary': ''" v-on:click="showOutflowInflow(false, true)">Show
          Inflow Only
        </v-btn>
        <v-btn flat :color="showInflow && showOutflow ? 'primary': ''" v-on:click="showOutflowInflow(true, true)">Show
          Both
        </v-btn>
        <v-btn flat :color="!showInflow && showOutflow ? 'primary': ''" v-on:click="showOutflowInflow(true, false)">Show
          Outflow Only
        </v-btn>

        <svg id="D3Container" width="100%" height="600">
          <g v-for="(d, i) in nodes" :transform="'translate(' + d.x + ',' + d.y + ')'" class="data-group">
            <circle :r="d.r" :fill="d.color" v-on:click="goToRegion(d.name)"></circle>
            <text text-anchor="middle" fill="#ffffff" :transform="'translate(' + 0 + ',' + (d.r * -1 + 20) + ')'">{{d.r}}K</text>
            <text text-anchor="middle" :transform="'translate(' + 0 + ',' + d.y + ')'">{{d.name}}</text>
          </g>
        </svg>

        <v-card-text>
          The total number of migrants this year was: {{globalTotal}}K.
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    data() {
      return {
        nodes: [],
        showOutflow: false,
        showInflow: true,
        globalTotalOutflow: 0,
        globalTotalInflow: 0,
        globalTotal: 0,
      }
    },
    methods: {
      showOutflowInflow(outflow, inflow) {
        this.showOutflow = outflow;
        this.showInflow = inflow;
        this.updateDisplay();
      },
      updateDisplay() {
        const inflow = this.showInflow ? this.getInflowData() : [];
        const outflow = this.showOutflow ? this.getOutflowData() : [];

        // Concat the two arrays together and

        this.nodes = inflow.concat(outflow).sort((a, b) => {

          // First sort by position

          if (a.x < b.x) return -1;
          if (a.x > b.x) return 1;

          // Next sort by biggest value

          if (a.r < b.r) return 1;
          if (a.r > b.r) return -1;
          if (a.r === b.r) return 0;
        });

        this.computeTotal();
      },
      computeTotal(){

        if(this.showInflow && !this.showOutflow) this.globalTotal = this.globalTotalInflow;
        if(!this.showInflow && this.showOutflow) this.globalTotal = this.globalTotalOutflow;
        if(this.showInflow && this.showOutflow) this.globalTotal = this.globalTotalInflow - this.globalTotalOutflow;
      },
      getOutflowData() {
        const row = this.getFirstRow(this.outflowData);
        return this.computeRegionNodes(row, true);
      },
      getInflowData() {
        const row = this.getFirstRow(this.inflowData);
        return this.computeRegionNodes(row, false);
      },
      getFirstRow(data) {

        let row = [];

        data.some((dataRow) => {

          if (dataRow[0].indexOf(`${this.year.toString().slice(-2)}`) !== -1) {

            row = dataRow;
            return true;
          }
        });

        return row;
      },
      computeRegionNodes(row, outflow) {

        const nodes = [];
        let globalTotal = 0;

        Object.keys(this.regions).forEach((region, index) => {

          const total = parseInt(row[this.headers.indexOf(region)]);
          globalTotal += total;

          nodes.push({
            "x": 400 * index + 150,
            "y": 250,
            "r": total,
            "name": region,
            'color': outflow ? '#4DA6FF' : '#607D8B',
            'outflow': outflow
          });
        });

        if(outflow) this.globalTotalOutflow = globalTotal;
        if(!outflow) this.globalTotalInflow = globalTotal;

        return nodes;
      },
      goToRegion(regionName) {
        this.$router.push('/regions/' + regionName);
      }
    },
    computed: {
      regions: function () {
        return this.$store.state.regions;
      },
      headers: function () {
        return this.$store.state.dataHeaders;
      },
      year: function () {
        return this.$store.state.year;
      },
      outflowData() {
        return this.$store.state.outflowData.filter((row) => {
          if (row.length < 2) return false;
          return row[1].indexOf('All reasons') !== -1 && (row[0].indexOf('Dec') !== -1 || row[0].indexOf('Jun 17') !== -1);
        });
      },
      inflowData() {
        return this.$store.state.inflowData.filter((row) => {
          if (row.length < 2) return false;
          return row[1].indexOf('All reasons') !== -1 && (row[0].indexOf('Dec') !== -1 || row[0].indexOf('Jun 17') !== -1);
        });
      }
    },
    created() {
      this.$store.watch(
        (state) => state.year,
        () => this.updateDisplay()
      );
      this.updateDisplay();
    }
  }
</script>

<style lang="scss" scoped>
  .data-group {
    cursor: pointer;

    &:hover circle {
      fill: #1e88e5;
    }
  }

  circle {
    transition: all 0.1s;
  }
</style>
