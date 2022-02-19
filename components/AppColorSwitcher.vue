<template>
  <span class="inline-flex">
    <button
      class="rounded-md hover:text-primary-500 focus:outline-none transition ease-in-out duration-150"
      aria-label="Color Mode"
      @click="
        $colorMode.value === 'dark'
          ? ($colorMode.preference = 'light')
          : ($colorMode.preference = 'dark')
      "
    >
      <IconSun v-if="$colorMode.value === 'light'" class="w-6 h-6" />
      <IconMoon v-else class="w-6 h-6" />
    </button>
  </span>
</template>

<script>
export default {}
</script>
