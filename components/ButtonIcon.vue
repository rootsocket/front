<template>
  <div
    class="select-none my-4 px-2 rounded font-medium py-1 cursor-pointer flex items-center text-gray-500 border border-gray-300 dark:border-gray-700"
    @click="$emit('click')"
  >
    <span class="mr-2 h-6 w-6"> <slot /></span>
    {{ title }}
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
