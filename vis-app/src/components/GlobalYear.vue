<template>
  <v-container fluid>
    <svg id="D3Container"></svg>
    <v-card>
      <v-slider v-model="year" thumb-label step="1" min="2007" max="2016" ticks v-on:input="changeYear"/>
    </v-card>
  </v-container>
</template>

<script>
  import PerYear from '../perYear';

  export default {
    data() {
      return {
        year: 2007
      }
    },
    methods: {
      changeYear() {
        this.perYear.showYear(this.year);
      }
    },
    mounted() {
      this.perYear = new PerYear(this.$d3);
      this.changeYear();

      document.addEventListener('region_clicked', (event) => {

        console.log(event.detail);
        this.$router.push('/regions/'+event.detail.name);
      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
