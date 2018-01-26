<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card dark color="primary">
        <v-card-title primary-title>
          <div>
            <h1 class="headline">{{immigrationTotal}} million {{regionName}} entered the UK in {{this.year}}</h1>
            <div>Where exactly did they come from and what are they here for?{{totalRefusals}} people were refused
              entry
            </div>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
    <v-flex xs6>
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
                <v-flex xs11>
                  <svg id="D3Container" width="100%" height="500">
                    <svg width="100%" class="inner-svg" :y="svgOffset * -1">
                      <text v-for="(total, name, index) in countryTotals" :x="(33 * (index  % 3) + 10) + '%'"
                            :y="170 * Math.floor(index  / 3) + 100">{{name}}
                      </text>
                      <circle v-for="(total, name, index) in countryTotals" :cx="(33 * (index  % 3) + 15) + '%'"
                              :cy="170 * Math.floor(index  / 3) + 30"
                              :r="total/10000" fill="#4DA6FF"></circle>
                    </svg>
                  </svg>
                </v-flex>
                <v-flex xs1 class="svg-nav">
                  <div class="svg-nav">
                    <i class="material-icons" v-on:click="setSvgOffset(svgOffset - 510)">arrow_upward</i>
                    <i class="material-icons" v-on:click="setSvgOffset(svgOffset + 510)">arrow_downward</i>
                  </div>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>

    </v-flex>
    <v-flex xs6>
      <v-card>
        <v-card-title primary-title>
          <div>
            <h1 class="headline">Why are they in the UK?</h1>
          </div>
        </v-card-title>
        <v-card-text>
          <svg width="100%" height="480">
            <g transform="translate(60,15)">
              <g>
                <g :transform="'translate(' + (57 + (66 * (index))) + ',450)'" style="opacity: 1;"
                   v-for="(total, name, index) in totals">
                  <line x2="0" y2="0"></line>
                  <text dy=".32em" x="-3" y="0" style="text-anchor: end;">{{name}}</text>
                </g>
                <path d="M0,0H0V470H0"></path>
              </g>
              <g v-for="(total, name, index) in totals">
                <rect class="bar" :x="(10 + (66 * (index)))" :height="total/10000" :y="430 - total/10000" fill='#5f89ad'
                      width="59"></rect>
                <text class="label" :x="(10 + (66 * (index)))" :y="430 - total/10000 - 3" style="text-anchor: start;">
                  {{total}}
                </text>
              </g>
            </g>
          </svg>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import ParseCSV from "../parseCSV";
  import admissionsTotal from '../assets/datasets/admissions_total.csv';
  import refusedTotal from '../assets/datasets/refused_by_country.csv';
  import purposeAdmissions from '../assets/datasets/admissions_purpose_year.csv'; // Only available on a per year basis

  export default {
    name: "region-statistics",
    data() {
      return {
        nodes: [],
        regionName: this.$route.params.name,
        immigrationTotal: 0,
        totalRefusals: 0,
        totals: {
          'work': 0,
          'study': 0,
          'family': 0,
          'other': 0
        },
        countryTotals: {},
        regionBreakDown: {
          ['Non-EEA Nationals']: [
            'Africa North',
            'Africa Sub-Saharan',
            'America North',
            'America Central and South',
            'Asia Central',
            'Asia East',
            'Asia South',
            'Asia South East',
            'Middle East',
            'Oceania',
            'Other'
          ],
          ['EEA Nationals']: [
            'EU 14',
            'EU 2',
            'EU 8',
            'EU Other',
          ],
          ['British Citizens']: [],
          ['Other EEA and Swiss Nationals']: [
            'Europe Other'
          ]
        },
        svgOffset: 0,
      }
    },
    methods: {
      setSvgOffset(offset){
        this.svgOffset = offset;
      },
      updateDisplay() {
        this.computeImmigrationTotal();
        this.computeRefusals();
        this.computeEntryPurpose();
        this.computerPerCountryTotals();
      },
      computeImmigrationTotal() {
        ParseCSV.parseCSV(admissionsTotal).then(({headers, data}) => {

          let regionTotal = 0;

          for (let i = this.startIndex; i < this.endIndex; i++) {

            regionTotal += parseFloat(data[i][this.selectedRegion + 2]);
          }

          this.immigrationTotal = regionTotal.toFixed(2);
        });
      },
      computeEntryPurpose() {
        ParseCSV.parseCSV(purposeAdmissions).then(({headers, data}) => {

          // Get all rows for the given year

          let rows = data.filter(row => row[0].indexOf(this.year) !== -1);

          // If quarter active, narrow down to the specific quarter

          if (this.quarter > -1) {

            rows = rows.filter(row => row[0].indexOf(`${this.year}`) !== -1);
          }

          // Get the total number of refusals for the region - the first occurrence of every label

          const totals = {
            'work': 0,
            'study': 0,
            'family': 0,
            'other': 0
          };

          rows.forEach((row) => {

            this.regionBreakDown[this.regionName].forEach((subRegionName) => {

              if (row[2].indexOf(`*Total ${subRegionName}`) !== -1) {

                totals.work += Number(parseFloat(row[4].replace(',', '')).toFixed(2));
                totals.study += Number(parseFloat(row[5].replace(',', '')).toFixed(2));
                totals.family += Number(parseFloat(row[6].replace(',', '')).toFixed(2));
                totals.other += Number(parseFloat(row[7].replace(',', '')).toFixed(2));
              }
            });
          });

          this.totals = totals;
        });
      },
      computeRefusals() {
        ParseCSV.parseCSV(refusedTotal).then(({headers, data}) => {

          // Get all rows for the given year

          let rows = data.filter(row => row[0].indexOf(this.year) !== -1);

          // If quarter active, narrow down to the specific quarter

          if (this.quarter > -1) {

            rows = rows.filter(row => row[0].indexOf(`${this.year} Q${this.quarter}`) !== -1);
          }

          // Get the total number of refusals for the region - the first occurrence of every label

          let total = 0;

          rows.forEach((row) => {

            this.regionBreakDown[this.regionName].forEach((subRegionName) => {

              if (row[2].indexOf(`*Total ${subRegionName}`) !== -1) {

                total += Number(parseFloat(row[3].replace(',', '')).toFixed(2));
              }
            });
          });

          this.totalRefusals = total;
        });
      },
      computerPerCountryTotals() {
        ParseCSV.parseCSV(purposeAdmissions).then(({headers, data}) => {

          // Get all rows for the given year

          let rows = data.filter(row => row[0].indexOf(this.year) !== -1);

          // If quarter active, narrow down to the specific quarter

          if (this.quarter > -1) {

            rows = rows.filter(row => row[0].indexOf(`${this.year}`) !== -1);
          }

          // Get the total number of refusals for the region - the first occurrence of every label

          const totals = {};

          rows.forEach((row) => {

            this.regionBreakDown[this.regionName].forEach((subRegionName) => {

              if (row[1].indexOf(`${subRegionName}`) !== -1 && row[2].indexOf(`*Total`) === -1) {

                totals[row[2]] = Number(parseFloat(row[3].replace(',', '')).toFixed(2));
              }
            });
          });
          console.log(totals);

          this.countryTotals = totals;
        });
      }
    },
    computed: {
      regions: function () {
        return this.$store.state.availableRegions;
      },
      selectedRegion: function () {
        return this.$store.state.selectedRegion;
      },
      year: function () {
        return this.$store.state.year;
      },
      quarter: function () {
        return this.$store.state.quarter;
      },
      startIndex: function () {
        return this.$store.state.startIndex;
      },
      endIndex: function () {
        return this.$store.state.endIndex;
      }
    },
    created() {
      this.$store.commit('set_region', this.regionName);
      this.updateDisplay();

      this.$store.watch(
        (state) => state.timeChanged,
        () => this.updateDisplay()
      );
    }
  }
</script>

<style scoped>

  .svg-nav{
    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  i{
    padding: 4rem 0;
    cursor: pointer;
  }
  .inner-svg{
    overflow: visible;
  }
</style>
