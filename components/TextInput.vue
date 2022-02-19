<template>
  <input
    :type="type"
    class="border dark:border-gray-600 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full bg-white dark:bg-gray-900"
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
