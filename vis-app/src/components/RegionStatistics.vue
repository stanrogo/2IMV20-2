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
      SubRegionNodes},
    name: "region-statistics",
    data() {
      return {
        immigrationTotal: 0,
      }
    },
    methods: {
      updateDisplay() {
        this.computeTotalImmigration();
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

<style lang="scss" scoped>
  circle, rect {
    transition: all 0.1s;
  }
</style>
