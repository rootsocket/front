<template>
  <div class="flex h-screen">
    <div class="m-auto">
      <div class="flex flex-col lg:flex-row lg:items-center">
        <Logo />
        <span class="mt-4 lg:mt-0">{{ $t('ohError') }}</span>
      </div>
      <ButtonPressable
        variant="primary"
        :value="$t('goBack')"
        class="mt-5"
        @click="$router.go(-1)"
      />
      <div
        class="p-4 bg-white-100 rounded-md shadow border dark:border-gray-700 mt-4 w-64 lg:w-96 max-h-52 overflow-auto"
      >
        <pre class="select-all">{{ JSON.stringify(error, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'base', // you can set a custom layout for the error page
  props: {
    error: {
      type: Object,
      default: () => ({}),
    },
  },
  head() {
    return {
      title: `Error - ${this.$config.projectTitle}`,
    }
  },
}
</script>

<i18n>
{
  "en": {
    "goBack": "Go back to previous page",
    "ohError": "Something went wrong :("
  },
  "es": {
    "goBack": "Volver a la página anterior",
    "ohError": "Algo ha ido mal :("
  }
}
</i18n>
