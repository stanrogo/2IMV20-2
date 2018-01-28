<template>
  <v-card>
    <v-card-title>
      Drag to see statistics based on a particular year
    </v-card-title>
    <v-card-text>
      <v-slider :label="sliderLabel" v-model="year" thumb-label step="1" min="2007" max="2017" ticks/>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: "range-slider",
    computed: {
      year:{
        get(){
          return this.$store.state.year;
        },
        set(year){
          this.$store.state.year = year;
        }
      },
      sliderLabel() {
        return `${this.year}`;
      }
    }
  }
</script>
