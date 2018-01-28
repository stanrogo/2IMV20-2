<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card dark color="primary">
        <v-card-title primary-title class="flex-card">
          <div class="card-left">
            <h1 class="headline">{{headline}}</h1>
            <div>{{subHeading}}</div>
          </div>
          <v-switch class="switch-right" :label="outflow ? 'Outflow': 'Inflow'" v-model="outflow"/>
        </v-card-title>
      </v-card>
    </v-flex>
    <v-flex xs6>
      <sub-region-nodes/>
    </v-flex>
    <v-flex xs6>
      <sub-region-categories/>
    </v-flex>
  </v-layout>
</template>

<script>

  import SubRegionNodes from "./SubRegionNodes";
  import SubRegionCategories from "./SubRegionCategories";

  export default {
    components: {
      SubRegionCategories,
      SubRegionNodes
    },
    name: "region-statistics",
    data() {
      return {
        immigrationTotal: 0
      }
    },
    watch: {
      outflow: function () {
        this.updateDisplay();
      }
    },
    methods: {
      updateDisplay() {
        this.computeTotalImmigration();
      },
      computeTotalImmigration() {
        const data = this.outflow ? this.outflowData : this.inflowData;
        const row = this.getFirstRow(data);
        this.immigrationTotal = row[this.headers.indexOf(this.selectedRegion)];
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
      }
    },
    computed: {
      selectedRegion: function () {
        return this.$store.state.selectedRegion;
      },
      headers: function () {
        return this.$store.state.dataHeaders;
      },
      headline() {
        if (this.outflow) {
          return `${this.immigrationTotal},000 people left the UK to go back to the ${this.selectedRegion} in ${this.year}`;
        }

        return `${this.immigrationTotal},000 people from ${this.selectedRegion} entered the UK in ${this.year}`;
      },
      subHeading() {
        if (this.outflow) {
          return 'Where exactly did they go and what did they go there for?';
        }

        return 'Where exactly did they come from and what are they here for?';
      },
      outflow: {
        get() {
          return this.$store.state.outflow;
        },
        set(value) {
          this.$store.state.outflow = value;
        }
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

<style lang="scss">
  circle, rect {
    transition: all 0.1s;
  }

  .flex-card {
    display: flex;

    .card-left {
      flex: 1;
    }

    .switch-right {
      flex: 0 0 160px;
      height: 21px;
      margin-top: -10px;
    }
  }
</style>
