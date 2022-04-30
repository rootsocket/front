<template>
  <div />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  auth: false,
  beforeMount() {
    if (this.$auth.loggedIn) {
      this.$router.push(this.localePath({ name: 'applications' }))
    } else {
      this.$router.push(this.localePath({ name: 'login' }))
    }
  },
})
</script>
