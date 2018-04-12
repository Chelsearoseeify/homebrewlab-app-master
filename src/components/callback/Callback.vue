<template>
</template>
<script>

import { setAccessToken, setIdToken } from '../../assets/auth';

export default {
  name: '',
  mounted() {
    this.$nextTick(() => {
      setAccessToken();
      setIdToken();
      window.location.href = '/';
    });
  },
};
</script>