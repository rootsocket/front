<template>
  <span :class="`inline-block px-2 py-1 text-xs rounded-full ${classes}`">{{
    value
  }}</span>
</template>

<script lang="ts">
import Vue from 'vue'

enum Variant {
  default = 'default',
  primary = 'primary',
  green = 'green',
  red = 'red',
  warning = 'warning',
}

export default Vue.extend({
  props: {
    value: {
      type: String,
      default: '',
    },
    variant: {
      type: String,
      default: Variant.default,
    },
  },
  computed: {
    classes() {
      switch (this.variant) {
        case Variant.primary:
          return 'bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-100 border border-primary-200 dark:border-primary-700'
        case Variant.green:
          return 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-100 border border-green-200 dark:border-green-700'
        case Variant.red:
          return 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-100 border border-red-200 dark:border-red-700'
        case Variant.warning:
          return 'bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-100 border border-yellow-200 dark:border-yellow-700'
        default:
          return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
      }
    },
  },
})
</script>
