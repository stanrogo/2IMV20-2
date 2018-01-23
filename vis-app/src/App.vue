<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
  import ParseCSV from './parseCSV'

  // CSV file imports

  import admissionsTotal from './assets/datasets/admissions_total.csv';

  export default {
    name: 'app',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted() {
      this.$d3.selectAll('h1').style('font-size', '10px');

      const parseCSV = new ParseCSV();
      parseCSV.parseCSV(admissionsTotal).then((data) => {

        const headers = data.shift();
        console.log(headers);

        // Every 4 elements in the array form 1 year

        let total = 0;
        const jsonCircles = [];

        for(let i = 0; i < data.length; i++){

          if(i % 4 === 0 && i !== 0){

            jsonCircles.push({
              "x_axis": 150*(i/4), "y_axis": 100, "radius": total/2, "color": "green"
            });
            total = 0;
          }

          total += parseFloat(data[i][1]);
        }

        console.log(jsonCircles);

        const svgContainer = this.$d3.select("body").append("svg")
          .attr("width", 1600)
          .attr("height", 500);

        const circles = svgContainer.selectAll("circle")
          .data(jsonCircles)
          .enter()
          .append("circle");

        const circleAttributes = circles
          .attr("cx", function (d) {
            return d.x_axis;
          })
          .attr("cy", function (d) {
            return d.y_axis;
          })
          .attr("r", function (d) {
            return d.radius;
          })
          .style("fill", function (d) {
            return d.color;
          });
      });
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
