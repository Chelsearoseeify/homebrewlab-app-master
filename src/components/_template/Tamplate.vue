<!-- HTML template of component -->
<template>

<!-- Each component must contain exactly ONE root element -->
<!-- The class "template" is not mandatory, but may be used to assign styles -->
<div class="template">
  <p>This is where your content goes...</p>
</div>

</template>


<!-- CSS styles for the component -->
<!-- The attribute scoped tells Vue to make all styles local to the component only -->
<style scoped>

</style>


<!-- The JS application logic of the component -->
<script>

// Each component must export one module
export default {
  // The name of the component identifies the component inside the application
  // In order to include a new component in the HomebrewLab menu, two actions are needed:
  // (1) in router/index.js import the component and match it to a URL route
  // (2) in App.vue add an entry to the menu and associate it with the new route
  name: 'Template',

  // The props element allows the component to accept input from the parent component
  props: [],

  // Function automatically invoked by Vue upon rendering of the component
  // Place here possible initializations of Semantic UI modules
  mounted: function () {

  }

  // Custom methods of the component
  methods: {
    method_one: function() {

    }
  }
}

</script>
