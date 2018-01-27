<template>
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
</template>

<script>
  export default {
    name: "sub-region-categories",
    data(){
      return{
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
      updateDisplay(){
        this.computeImmigrationReasons();
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
      inflowData() {
        return this.$store.state.inflowData.filter((row) => {
          if (row.length < 2) return false;
          return row[0].indexOf('Dec') !== -1;
        });
      },
      outflowData() {
        return this.$store.state.inflowData.filter((row) => {
          if (row.length < 2) return false;
          return row[0].indexOf('Dec') !== -1;
        });
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
