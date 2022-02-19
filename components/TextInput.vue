<template>
  <input
    :type="type"
    class="truncate leading-5 placeholder-gray-500 border border-transparent text-gray-700 dark:text-white dark-focus:text-white focus:border-gray-300 dark-focus:border-gray-700 rounded-md focus:outline-none focus:bg-white dark-focus:bg-gray-900 bg-gray-50 dark:bg-gray-800 px-3 py-2 mt-1 mb-5 w-full"
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
