<template>
  <v-container fluid>
    <svg id="D3Container"></svg>
    <v-card>
      <v-slider v-model="year" thumb-label step="1" min="2007" max="2016" ticks v-on:input="changeYear"/>
    </v-card>
  </v-container>
</template>

<script>
  export default {
    name: "region-statistics"
  }
</script>

<style scoped>

</style>
