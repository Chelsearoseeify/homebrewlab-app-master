<template>
<div class="tabs_container">
  <div>
    <div v-for="(tab, index) in tabs" :key="tab.path"
         v-bind:class="{active_tab: tab.path==$route.fullPath, inactive_tab: tab.path!=$route.fullPath}">
      <router-link v-bind:to="tab.path">
        {{tab.name}} <i class="remove icon small" v-if="tab.path!='/'" v-on:click="removeTab(index,$event)"></i>
      </router-link>
    </div>
  </div>
</div>

</template>

<style scoped>

.tabs_container {
  border-bottom: 3px solid lightgray;
  padding: 10px;
  margin-top:20px;
  margin-bottom:20px;
  color: black;
}

.active_tab {
  border-bottom: 3px solid orange;
  padding: 10px;
  font-weight: bold;
  font-size: 1.5em;
  display: inline;
}

.inactive_tab {
  border-bottom: 3px solid lightgray;
  padding: 11px;
  font-weight: normal;
  display: inline;
}

a {
  color: black;
}

</style>


<script>
  export default {
    name: 'Tabs',
    props: ['tabs'],
    methods: {
      removeTab: function(index,event) {
        event.preventDefault();
        this.$emit('tabRemovalRequest', index);
      }
    }
  }
</script>
