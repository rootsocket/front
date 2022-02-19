<template>
  <button
    :type="loading ? 'button' : type"
    :class="`
      relative
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
    @click="loading ? noop : $emit('click')"
  >
    <div
      class="absolute w-full flex justify-center"
      :class="{ 'opacity-0': !loading }"
    >
      <IconLoad />
    </div>
    <span class="inline-block mr-2" :class="{ 'opacity-0': loading }">{{
      value
    }}</span>
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
              border-gray-200
              dark:border-gray-700
              text-gray-500
              dark:text-gray-300
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
