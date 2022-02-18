<template>
  <label class="font-semibold text-sm text-gray-600 pb-1 block">{{
    value
  }}</label>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
    },
  },
})
</script>
