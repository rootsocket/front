<template>
  <div
    :class="`rounded-full h-5 w-5 flex flex-row items-center justify-center ${classes}`"
    @click="$emit('click')"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      class="w-4 h-4"
      width="24px"
      fill="currentColor"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path
        d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
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
