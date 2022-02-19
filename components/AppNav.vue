<template>
  <aside
    class="w-full lg:w-1/5 lg:block fixed lg:relative inset-0 mt-16 lg:mt-0 z-30 bg-white dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent"
    :class="{ block: menu, hidden: !menu }"
  >
    <div
      class="lg:sticky lg:top-16 overflow-y-auto h-full lg:h-auto lg:max-h-(screen-16)"
    >
      <ul class="p-4 lg:py-8 lg:pl-0 lg:pr-8">
        <li class="lg:hidden space-x-2">
          <p
            class="mb-2 text-gray-500 uppercase tracking-wider font-bold text-sm lg:text-xs"
          >
            More
          </p>
          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/"
              class="font-semibold leading-none text-gray-700 dark:text-gray-300 hover:text-primary-500 dark-hover:text-primary-500 text-base"
              exact-active-class="text-primary-500"
              >{{ $t('applications') }}</NuxtLink
            >
            <NuxtLink
              to="/"
              class="font-semibold leading-none text-gray-700 dark:text-gray-300 hover:text-primary-500 dark-hover:text-primary-500 text-base"
              exact-active-class="text-primary-500"
              >{{ $t('billing') }}</NuxtLink
            >
            <NuxtLink
              to="/"
              class="font-semibold leading-none text-gray-700 dark:text-gray-300 hover:text-primary-500 dark-hover:text-primary-500 text-base"
              exact-active-class="text-primary-500"
              >{{ $t('account') }}</NuxtLink
            >
          </div>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
export default {
  computed: {
    menu: {
      get() {
        return this.$store.state.menu.open
      },
      set(val) {
        this.$store.commit('menu/toggle', val)
      },
    },
  },
}
</script>

<i18n>
{
  "en": {
    "applications": "Applications",
    "billing": "Billing",
    "account": "Account"
  },
  "es": {
    "applications": "Aplicaciones",
    "billing": "Facturación",
    "account": "Cuenta"
  }
}
</i18n>
