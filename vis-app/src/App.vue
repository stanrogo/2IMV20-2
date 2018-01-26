<template>
  <v-app>
    <v-navigation-drawer persistent v-model="drawer" enable-resize-watcher fixed app>
      <v-list>
        <v-list-tile value="true" v-for="(item, i) in items" :key="i">
          <v-list-tile-action>
            <v-icon v-html="item.icon"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"/>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title v-text="title"/>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <router-view/>
        <range-slider/>
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>

  import RangeSlider from "./components/RangeSlider";

  export default {
    components: {RangeSlider},
    name: 'app',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        drawer: true,
        items: [{
          icon: 'bubble_chart',
          title: 'Inspire'
        }],
        title: 'Immigration in the UK'
      }
    }
  }
</script>

<style lang="scss">

</style>
