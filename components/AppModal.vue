<template>
  <div
    class="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
    :class="{ hidden: !show }"
  >
    <div class="absolute bg-black opacity-90 inset-0 z-0" @click="close"></div>
    <div
      class="w-full max-w-lg p-5 relative mx-auto my-auto md:rounded-xl shadow-lg bg-white dark:bg-gray-900 max-h-screen overflow-auto"
    >
      <!--content-->
      <div class="">
        <div class="flex w-full justify-between mb-4">
          <h2 class="text-xl truncate flex-1 mr-4">{{ title }}</h2>
          <IconClose class="h-8 w-8 cursor-pointer" @click="close" />
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  watch: {
    show(show) {
      if (show) {
        document.body.classList.add('modal-open')
      } else {
        document.body.classList.remove('modal-open')
      }
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
})
</script>

<style>
.modal-open {
  overflow: hidden;
}
</style>
