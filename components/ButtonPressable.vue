<template>
  <button
    :type="loading ? 'button' : type"
    :class="`
      relative
      text-center
      inline-block
      justify-center
      px-4
      py-2.5
      rounded-lg
      text-sm
      shadow-sm
      hover:shadow-md
      transition
      duration-200
      ${classes}
    `"
    @click="loading ? noop : $emit('click')"
  >
    <div
      class="absolute left-0 ml-2 w-full flex justify-center items-center"
      :class="{ 'opacity-0': !loading }"
    >
      <IconLoad />
    </div>
    <span class="inline-block" :class="{ 'opacity-0': loading }">{{
      value
    }}</span>
  </button>
</template>

<script lang="ts">
import Vue from 'vue'

enum Variant {
  primary = 'primary',
  outline = 'outline',
  red = 'red',
  outlineRed = 'outline-red',
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
    loading: {
      type: Boolean,
      default: false,
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
              border-gray-300
              dark:border-gray-800
              text-gray-600
              dark:text-gray-300
              font-normal
            `
        case Variant.red:
          return `
              bg-red-500
              hover:bg-red-600
              focus:bg-red-700
              focus:shadow-sm
              focus:ring-4
              focus:ring-red-500
              focus:ring-opacity-50
              text-white
              font-semibold
          `
        case Variant.outlineRed:
          return `
            border
            border-red-500
            dark:border-red-600
            text-red-500
            dark:text-red-600
            font-normal
          `
        default:
          return ''
      }
    },
  },
  methods: {
    noop() {},
  },
})
</script>
