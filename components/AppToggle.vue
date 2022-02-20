<template>
  <div
    class="inline-flex items-center cursor-pointer select-none"
    @click="toggle"
  >
    <div
      class="relative inline-block w-8 mr-2 align-middle select-none transition duration-200 ease-in"
    >
      <input
        id="toggle"
        type="checkbox"
        name="toggle"
        class="bg-white dark:bg-gray-700 mr-1 focus:ring-transparent toggle-checkbox absolute block w-3 h-3 rounded-full appearance-none cursor-pointer"
        :checked="value"
      />
      <label
        for="toggle"
        class="toggle-label block h-5 -ml-1 -mt-1 rounded-full bg-gray-300 dark:bg-gray-800 cursor-pointer"
        @click="toggle"
      ></label>
    </div>

    <span class="-mt-1 text-sm ml-2">{{ label }}</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
  },
  methods: {
    toggle() {
      this.$emit('input', !this.value)
    },
  },
})
</script>

<style lang="scss" scoped>
.toggle-checkbox:checked {
  right: 0;
  border: none;
  background-color: theme('colors.white');
}

.toggle-checkbox:checked + .toggle-label {
  background-color: theme('colors.primary.500');
}
</style>
