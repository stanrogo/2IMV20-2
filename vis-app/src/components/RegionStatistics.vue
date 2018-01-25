<template>
    <svg id="D3Container"></svg>
</template>

<script>

  import Refused from '../refused';

  export default {
    name: "region-statistics",
    mounted(){
      this.refused = new Refused(this.$d3);
      this.showYear();
    }
  }
</script>

<style scoped>

</style>
