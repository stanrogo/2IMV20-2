<template>
  <svg id="D3Container"></svg>
</template>

<script>
  import GlobalStatisticsD3 from '../globalStatisticsD3';

  export default {
    methods: {
      updateDisplay() {
        this.globalStatisticsD3.year = this.year;
        this.globalStatisticsD3.quarter = this.quarter;
        this.globalStatisticsD3.showNodes();
      }
    },
    computed: {
      year: function () {
        return parseInt(this.$store.state.year);
      },
      quarter: function () {
        if(!this.$store.state.quarterActive){
          return null;
        }
        return (Number((this.$store.state.year % 1).toFixed(2)) + 0.25) * 4;
      },
    },
    created() {
      this.$store.watch(
        () => this.$store.state.year,
        () => this.updateDisplay()
      );
      this.$store.watch(
        () => this.$store.state.quarterActive,
        () => this.updateDisplay()
      );
    },
    mounted() {
      this.globalStatisticsD3 = new GlobalStatisticsD3(this.$d3);
      this.updateDisplay();

      document.addEventListener('region_clicked', (event) => {

        this.$router.push('/regions/' + event.detail.name);
      });
    }
  }
</script>
