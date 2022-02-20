<template>
  <aside
    class="w-full lg:w-1/5 lg:block fixed lg:relative inset-0 mt-16 lg:mt-0 z-30 bg-white dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent"
    :class="{ block: menu, hidden: !menu, 'lg:hidden': !showAside }"
  >
    <div
      class="lg:sticky lg:top-16 overflow-y-auto h-full lg:h-auto lg:max-h-(screen-16)"
    >
      <ul class="p-4 lg:py-8 lg:pl-0 lg:pr-8">
        <ul v-if="showAside">
          <p
            class="mb-2 text-gray-500 uppercase tracking-wider font-bold text-sm lg:text-xs w-full flex flex-row"
          >
            <span class="truncate flex-1 mr">{{ application.name }}</span>
          </p>
          <li
            v-for="page of categories"
            :key="page.title"
            class="text-gray-700 dark:text-gray-300"
          >
            <NuxtLink
              :to="
                localeLocation({
                  name: page.name,
                  params: { slug: $route.params.slug },
                })
              "
              class="px-2 rounded font-medium py-1 hover:text-primary-500 flex items-center justify-between"
              exact-active-class="text-primary-500 bg-primary-100 hover:text-primary-500 dark:bg-primary-900"
            >
              {{ $t(page.title) }}
              <client-only>
                <span
                  v-if="false"
                  class="animate-pulse rounded-full bg-primary-500 opacity-75 h-2 w-2"
                />
              </client-only>
            </NuxtLink>
          </li>
        </ul>
        <li class="lg:hidden space-x-2 mt-4">
          <p
            class="mb-2 text-gray-500 uppercase tracking-wider font-bold text-sm lg:text-xs"
          >
            More
          </p>
          <div class="flex items-center space-x-4">
            <NuxtLink
              :to="localeLocation({ name: 'applications' })"
              class="font-semibold leading-none text-gray-700 dark:text-gray-300 hover:text-primary-500 dark-hover:text-primary-500 text-base"
              exact-active-class="text-primary-500"
              >{{ $t('applications') }}</NuxtLink
            >
            <NuxtLink
              :to="localeLocation({ name: 'billing' })"
              class="font-semibold leading-none text-gray-700 dark:text-gray-300 hover:text-primary-500 dark-hover:text-primary-500 text-base"
              exact-active-class="text-primary-500"
              >{{ $t('billing') }}</NuxtLink
            >
            <NuxtLink
              :to="localeLocation({ name: 'account' })"
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
import { getCurrentApplication } from '@/utils/application'

export default {
  data() {
    return {
      categories: [
        { title: 'debug', name: 'applications-slug-debug' },
        { title: 'keys', name: 'applications-slug-keys' },
        {
          title: 'connections',
          name: 'applications-slug-connections',
        },
        { title: 'settings', name: 'applications-slug-settings' },
      ],
    }
  },
  computed: {
    menu: {
      get() {
        return this.$store.state.menu.open
      },
      set(val) {
        this.$store.commit('menu/toggle', val)
      },
    },
    showAside() {
      return $nuxt.$data.layoutName === 'application'
    },
    application() {
      return getCurrentApplication(this.$store.state, this.$route.params.slug)
    },
  },
  methods: {
    isActive(category) {
      return this.$route.fullPath.startsWith(category.name)
    },
  },
}
</script>

<i18n>
{
  "en": {
    "applications": "Applications",
    "billing": "Billing",
    "account": "Account",
    "debug": "Debug",
    "keys": "Keys",
    "connections": "Connections",
    "settings": "Settings"
  },
  "es": {
    "applications": "Aplicaciones",
    "billing": "Facturación",
    "account": "Cuenta",
    "debug": "Depurar",
    "keys": "Claves",
    "connections": "Conexiones",
    "settings": "Ajustes"
  }
}
</i18n>
