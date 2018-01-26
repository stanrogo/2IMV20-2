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
            <v-card-text>Here it is</v-card-text>
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
          <svg width="100%" height="500">
            <g transform="translate(60,15)">
              <g>
                <g :transform="'translate(' + (57 + (66 * (index))) + ',470)'" style="opacity: 1;"
                   v-for="(total, name, index) in totals">
                  <line x2="0" y2="0"></line>
                  <text dy=".32em" x="-3" y="0" style="text-anchor: end;">{{name}}</text>
                </g>
                <path d="M0,0H0V470H0"></path>
              </g>
              <g v-for="(total, name, index) in totals">
                <rect class="bar" :x="(10 + (66 * (index)))" :height="total/10000" :y="450 - total/10000" fill='#5f89ad'
                      width="59"></rect>
                <text class="label" :x="(10 + (66 * (index)))" :y="450 - total/10000 - 3" style="text-anchor: start;">
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
        }
      }
    },
    methods: {
      updateDisplay() {
        this.computeImmigrationTotal();
        this.computeRefusals();
        this.computeEntryPurpose();
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

          let totals = {
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

</style>
