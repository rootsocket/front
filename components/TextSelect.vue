<template>
  <select
    class="appearance-none truncate leading-5 placeholder-gray-500 border border-transparent text-gray-700 dark:text-white dark-focus:text-white focus:border-gray-300 dark-focus:border-gray-800 rounded-md focus:outline-none focus:bg-white dark-focus:bg-gray-900 bg-gray-50 dark:bg-gray-800 px-3 py-2 mt-1 mb-5 w-full"
    :required="required"
    @change="$emit('input', $event.target.value)"
  >
    <option
      value=""
      disabeld
      selected
      hidden
      aria-hidden
      aria-disabled
      aria-selected
    >
      {{ placeholder }}
    </option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.text }}
    </option>
  </select>
</template>

<script lang="ts">
import Vue from 'vue'

interface Option {
  value: string
  text: string
}

export default Vue.extend({
  props: {
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
    options: {
      type: Array as () => Option[],
      default: () => [],
    },
  },
})
</script>
