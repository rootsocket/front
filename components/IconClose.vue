<template>
  <div
    :class="`rounded-full h-5 w-5 flex flex-row items-center justify-center ${classes}`"
    @click="$emit('click')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="currentColor"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

enum Variant {
  default = 'default',
  primary = 'primary',
  red = 'red',
  green = 'green',
}

export default Vue.extend({
  props: {
    variant: {
      type: String as () => Variant,
      default: Variant.default,
    },
  },
  computed: {
    classes() {
      switch (this.variant) {
        case Variant.red:
          return 'text-red-600 bg-red-100'
        case Variant.primary:
          return 'text-primary-600 bg-primary-100'
        case Variant.green:
          return 'text-green-600 bg-green-100'
        default:
          return 'text-gray-600 bg-gray-200 dark:text-gray-100 dark:bg-gray-700'
      }
    },
  },
})
</script>
