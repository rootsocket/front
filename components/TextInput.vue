<template>
  <input
    :type="type"
    class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
    :placeholder="placeholder"
    :pattern="pattern"
    required
    @input="$emit('input', $event)"
  />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    type: {
      type: String,
      default: 'text',
    },
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    pattern: {
      type: String,
      default: '',
    },
  },
})
</script>
