<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card dark color="primary">
        <v-card-title primary-title>
          <div>
            <h1 class="headline">{{immigrationTotal}},000 people from {{selectedRegion}} entered the UK in {{year}}</h1>
            <div>Where exactly did they come from and what are they here for?</div>
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

    </v-flex>
    <v-flex xs6>
      <v-layout row wrap>
        <v-flex xs12 pb-0>
          <v-card dark color="gray">
            <v-card-title>Why are they in the UK?</v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs12 pt-0>
          <v-card>
            <v-card-text>
              <svg width="100%" height="480">
                <g transform="translate(60,15)">
                  <g>
                    <g :transform="'translate(-30,' + (40 + (66 * (index))) + ')'"
                       v-for="(total, name, index) in totals">
                      <line x2="0" y2="0"></line>
                      <text dy=".32em" x="-3" y="0" style="text-anchor: start;">{{name}}</text>
                    </g>
                    <path d="M0,0H0V470H0"></path>
                  </g>
                  <g v-for="(total, name, index) in totals">
                    <rect class="bar" :y="(10 + (66 * (index)))" :width="total * 2.5" x="100" fill='#5f89ad'
                          height="59"></rect>
                    <text class="label" :y="(40 + (66 * (index)))" :x="100 + total * 2.5 + 10" style="text-anchor: start;">
                      {{total}}
                    </text>
                  </g>
                </g>
              </svg>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>

  export default {
    name: "region-statistics",
    data() {
      return {
        nodes: [],
        immigrationTotal: 0,
        regionTotals: {},
        totals: {
          'Work related': 0,
          'Definite job': 0,
          'Looking for work': 0,
          'Accompany/Join': 0,
          'Formal Study': 0,
          'Going home to live': 0,
          'Other': 0,
          'No reason stated': 0
        }
      }
    },
    methods: {
      updateDisplay() {
        this.computeImmigrationPerRegion();
        this.computeImmigrationReasons();
        this.computeTotalImmigration();
      },
      computeImmigrationPerRegion(){
        const subRegionNames = this.regions[this.selectedRegion];
        const regionTotals = {};
        const row = this.getFirstRow(this.inflowData);

        subRegionNames.forEach((region) => {
          regionTotals[region] = parseInt(row[this.headers.indexOf(region)]);
        });

        this.regionTotals = regionTotals;
      },
      computeImmigrationReasons(){
        const reasonRows = this.inflowData.filter((row) => {
          return row[0].indexOf(`YE Dec ${this.year.toString().slice(-2)}`) !== -1;
        });

        const totals = {};

        reasonRows.forEach((row) => {
          totals[row[1]] = row[this.headers.indexOf(this.selectedRegion)];
        });

        this.totals = totals;
      },
      computeTotalImmigration(){
        const row = this.getFirstRow(this.inflowData);
        this.immigrationTotal = row[this.headers.indexOf(this.selectedRegion)];
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
      }
    },
    created() {
      this.$store.commit('set_region', this.$route.params.name);
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
