<template>
  <div class="home">
    <p>Le mie ricette:</p>
  </div>
</template>

<script>
  export default {
    name: 'Home',
    data () {
      return {
        msg: ''
      }
    },

    methods: {
      clean_url() {
        window.history.pushState(sessionStorage.getItem("token"), 'homebrewLab', '/home');
      }
    },

    beforeMount() {
      this.clean_url();
    },

    mounted: function () {
      $(document).ready(function() {
        $("#user").text(sessionStorage.getItem("user.name"));
      });
    },

  }
</script>
