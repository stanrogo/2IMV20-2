<template>
  <div id="app">
    <v-app>
      <v-content>
        <h1>Immigration in the UK</h1>
        <svg id="D3Container"></svg>
        <v-card>
          <v-slider v-model="value" thumb-label step="1" min="2007" max="2017" ticks v-on:click="changeYear"></v-slider>
        </v-card>
      </v-content>
    </v-app>

  </div>
</template>

<script>

  import PerYear from './perYear';

  export default {
    name: 'app',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        value: 2007
      }
    },
    methods: {
      changeYear(){
        this.perYear.showYear(this.value);
        console.log(this.value);
      }
    },
    mounted() {

      this.perYear = new PerYear(this.$d3);
      this.changeYear();
    }
  }
</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
