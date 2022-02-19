<template>
  <button
    :type="type"
    :class="`
      text-center
      inline-block
      w-full
      py-2.5
      rounded-lg
      text-sm
      shadow-sm
      hover:shadow-md
      transition
      duration-200
      ${classes}
    `"
    @click="$emit('click')"
  >
    <span class="inline-block mr-2">{{ value }}</span>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'

enum Variant {
  primary = 'primary',
  outline = 'outline',
}

enum ButtonType {
  button = 'button',
  submit = 'submit',
}

export default Vue.extend({
  props: {
    type: {
      type: String as () => ButtonType,
      default: ButtonType.button,
    },
    value: {
      type: String,
      default: '',
    },
    variant: {
      type: String as () => Variant,
      required: true,
    },
  },
  computed: {
    classes() {
      switch (this.variant) {
        case Variant.primary:
          return `
              bg-primary-500
              hover:bg-primary-600
              focus:bg-primary-700
              focus:shadow-sm
              focus:ring-4
              focus:ring-primary-500
              focus:ring-opacity-50
              text-white
              font-semibold
            `
        case Variant.outline:
          return `
              border
              border-gray-200
              dark:border-gray-600
              text-gray-500
              dark:text-gray-300
              font-normal
            `
        default:
          return ''
      }
    },
  },
})
</script>
