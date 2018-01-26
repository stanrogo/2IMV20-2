<template>
  <v-card>
    <v-card-text>
      <v-btn flat :color="yearColor" v-on:click="quarterActive = false">Per Year</v-btn>
      <v-btn flat :color="quarterColor" v-on:click="quarterActive = true">Per Quarter</v-btn>
      <v-slider :label="sliderLabel" v-model="fullYear" thumb-label :step="sliderSteps" min="2007" max="2016" ticks/>
    </v-card-text>
  </v-card>
</template>

<script>
  /**
   * Range Slider that can be set to per year or per quarter, depending on what you want
   */
  export default {
    name: "range-slider",
    computed: {
      year: function () {
        return this.$store.state.year;
      },
      quarter: function () {
        return this.$store.state.quarter;
      },
      fullYear: {
        get() {
          return this.$store.state.fullYear
        },
        set(newYear) {
          this.$store.commit('change_year', newYear);
        }
      },
      quarterActive: {
        get() {
          return this.$store.state.quarterActive;
        },
        set(isActive) {
          this.$store.commit('set_quarter_active', isActive);
        }
      },
      sliderSteps(){
        return this.quarterActive ? 0.25 : 1;
      },
      quarterColor() {
        return this.quarterActive ? "primary" : ""
      },
      yearColor() {
        return this.quarterActive ? "" : "primary"
      },
      sliderLabel() {
        return this.quarterActive ? `${this.year}, quarter ${this.quarter}` : `${this.year}`;
      }
    }
  }
</script>
