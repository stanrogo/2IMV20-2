<template>
  <v-layout row wrap>
    <v-flex xs12 pb-0>
      <v-card dark color="gray">
        <v-card-title class="flex-card">
          <div class="card-left">{{title}}</div>
          <v-switch class="switch-right" :label="subRegions ? 'Sub regions': 'Main region'" v-model="subRegions"/>
        </v-card-title>
      </v-card>
    </v-flex>
    <v-flex xs12 pt-0>
      <v-card>
        <v-card-text>
          <svg width="100%" height="500">
            <g transform="translate(60,15)">
              <g>
                <g :transform="'translate(-30,' + (30 + (50 * (index))) + ')'" v-for="(total, name, index) in totals">
                  <line x2="0" y2="0"></line>
                  <text dy=".32em" x="-3" y="0" style="text-anchor: start;">{{name}}</text>
                </g>
              </g>
              <g v-for="(total, name, index) in totals" v-if="!subRegions">
                <rect class="bar" :y="(10 + (50 * (index)))" :width="total * 2.5" x="100" fill='#5f89ad'
                      height="40"></rect>
                <text class="label" :y="(34 + (50 * (index)))" :x="100 + total * 2.5 + 10" style="text-anchor: start;">
                  {{total}}
                </text>
              </g>
              <g v-for="(subRegionsData, labelName, indexTop) in subRegionTotals" v-if="subRegions">
                <g v-for="(data, regionName, index) in subRegionsData">
                  <rect class="bar" :y="(10 + (50 * (indexTop)))" :width="data.total * 2.5" :x="100 + data.offset * 2.5"
                        :fill='data.fill'
                        height="40"></rect>
                </g>
              </g>
              <g v-if="subRegions" v-for="(total, region, index) in cumTotals">
                <text class="label" :y="(34 + (50 * (index)))" :x="100 + total * 2.5 + 10" style="text-anchor: start;">
                  {{total}}
                </text>
              </g>
              <g :transform="'translate(100,' + (Object.keys(totals).length * 50 + 10) + ')'" class="axis">
                <g class="tick" :transform="'translate(' + tick * 2.5 + ',0)'" style="opacity: 1;"
                   v-for="(tick) in ticks">
                  <line y2="6" x2="0"></line>
                  <text dy=".71em" y="9" x="0" style="text-anchor: middle;">{{tick}}</text>
                </g>
                <path class="domain" :d="'M0,2V0H' + maxTotal * 2.5 + 'V2'"></path>
              </g>
              <g v-if="subRegions" v-for="(colour, region, index) in regionColours" :transform="'translate(' + (maxTotal * 2.5 + 150) + ',' + index * 20 + ')'">
                <rect height="15" width="30" :fill="colour"></rect>
                <text class="label" transform="translate(40, 12.5)">{{region}}</text>
              </g>
            </g>
          </svg>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: "sub-region-categories",
    data() {
      return {
        totals: {
          'Work related': 0,
          'Definite job': 0,
          'Looking for work': 0,
          'Accompany/Join': 0,
          'Formal Study': 0,
          'Going home to live': 0,
          'Other': 0,
          'No reason stated': 0
        },
        regionColours: {},
        subRegions: false,
        subRegionTotals: {},
        cumTotals: {},
        ticks: [],
        maxTotal: 0,
      }
    },
    watch: {
      outflow: function () {
        this.updateDisplay();
      },
      subRegions: function () {
        this.updateDisplay();
      }
    },
    methods: {
      updateDisplay() {
        this.computeImmigrationReasons();
        this.computeImmigrationReasonsSubRegions();
      },
      computeImmigrationReasons() {
        const data = this.outflow ? this.outflowData : this.inflowData;
        const reasonRows = data.filter((row) => {
          return row[0].indexOf(`YE Dec ${this.year.toString().slice(-2)}`) !== -1;
        });

        const totals = {};
        let maxTotal = 0;

        reasonRows.forEach((row) => {
          if (!this.totals.hasOwnProperty(row[1])) return;

          let total = row[this.headers.indexOf(this.selectedRegion)];
          total = total.replace('~', '').replace('.', '0').replace(':', '0');

          totals[row[1]] = total;
          maxTotal = Math.max(maxTotal, total);
        });

        this.totals = totals;

        const largestTick = Math.ceil(maxTotal / 10) * 10;
        const ticks = [];
        for (let i = 0; i <= largestTick; i += 10) {
          ticks.push(i);
        }

        this.ticks = ticks;
        this.maxTotal = largestTick;
      },
      computeImmigrationReasonsSubRegions() {
        const data = this.outflow ? this.outflowData : this.inflowData;
        const reasonRows = data.filter((row) => {
          return row[0].indexOf(`YE Dec ${this.year.toString().slice(-2)}`) !== -1;
        });

        const totals = {};

        const subRegions = this.regions[this.selectedRegion];

        const fills = [
          '#2196f3',
          '#4caf50',
          '#ff9800',
          '#607d8b',
          '#009688',
          '#673ab7'
        ];

        subRegions.forEach((region) => {
          this.regionColours[region] = fills.pop();
        });

        reasonRows.forEach((row) => {
          if (!this.totals.hasOwnProperty(row[1])) return;

          totals[row[1]] = {};
          let offset = 0;

          let grandTotal = 0;

          subRegions.forEach((region) => {

            let total = row[this.headers.indexOf(region)];
            total = total.replace('~', '').replace('.', '0').replace(':', '0');

            totals[row[1]][region] = {'total': parseInt(total), 'offset': offset, 'fill': this.regionColours[region]};
            offset = offset + parseInt(total);
            grandTotal += parseInt(total);
          });

          this.cumTotals[row[1]] = grandTotal;
        });

        this.subRegionTotals = totals;
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
      inflowData() {
        return this.$store.state.inflowData.filter((row) => {
          if (row.length < 2) return false;
          return row[0].indexOf('Dec') !== -1;
        });
      },
      outflowData() {
        return this.$store.state.outflowData.filter((row) => {
          if (row.length < 2) return false;
          return row[0].indexOf('Dec') !== -1;
        });
      },
      title() {
        if (this.outflow) {
          return `Why did they go back to the ${this.selectedRegion}?`;
        }

        return 'Why are they in the UK?';
      }
    },
    created() {
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
