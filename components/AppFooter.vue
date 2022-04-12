<template>
  <footer
    class="h-16 relative w-full border-t dark:border-gray-800 bg-white dark:bg-gray-900 z-20"
  >
    <div
      class="h-full w-full container mx-auto px-4 lg:px-8 flex items-center justify-between"
    >
      <div class="flex items-start flex-col">
        <div class="text-lg">
          {{ $t('application') }}
        </div>
        <div class="flex space-x-4">
          <a
            :href="$config.projectBlog"
            target="_blank"
            rel="noopener"
            class="text-sm text-gray-500 hover:text-primary-500"
          >
            {{ $t('blog') }}
          </a>
          <a
            :href="$config.projectDocs"
            target="_blank"
            rel="noopener"
            class="text-sm text-gray-500 hover:text-primary-500"
          >
            {{ $t('docs') }}
          </a>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <AppLangSwitcher />
        <AppColorSwitcher />
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  computed: {
    availableLocales() {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    },
  },
}
</script>

<i18n>
{
  "en": {
    "application": "Application",
    "blog": "Blog",
    "docs": "Docs"
  },
  "es": {
    "application": "Aplicación",
    "blog": "Blog",
    "docs": "Docs"
  }
}
</i18n>
