<template>
  <div class="w-full lg:w-1/4 block relative">
    <div
      class="lg:sticky lg:top-16 overflow-y-auto h-full lg:h-auto lg:max-h-(screen-16)"
    >
      <nav class="py-4 lg:py-8 lg:px-8">
        <p
          class="mb-3 lg:mb-2 text-gray-500 uppercase tracking-wider font-bold text-sm lg:text-xs"
        >
          {{ title }}
        </p>
        <slot></slot>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    title: {
      type: String,
      default: '',
    },
  },
})
</script>
