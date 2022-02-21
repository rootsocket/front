<template>
  <input
    :type="type"
    class="truncate leading-5 placeholder-gray-500 border border-transparent text-gray-700 dark:text-white dark-focus:text-white focus:border-gray-300 dark-focus:border-gray-800 rounded-md focus:outline-none focus:bg-white dark-focus:bg-gray-900 bg-gray-50 dark:bg-gray-800 px-3 py-2 w-full"
    :class="{
      'cursor-not-allowed bg-gray-200 dark:bg-gray-400': disabled,
      'mb-5 mt-1': margin,
    }"
    :placeholder="placeholder"
    :pattern="pattern !== '' ? pattern : undefined"
    :required="required"
    :disabled="disabled"
    :value="value"
    @input="$emit('input', $event.target.value)"
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
    disabled: {
      type: Boolean,
      default: false,
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
    margin: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
