<template>
  <nav
    class="fixed top-0 z-40 w-full border-b dark:border-gray-800 bg-white dark:bg-gray-900"
    :class="{ 'shadow border-transparent': scrolled }"
    @click="scrollToTop"
  >
    <div class="container mx-auto flex-1 px-4 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="lg:w-1/5 flex items-center pr-4" @click.stop="noop">
          <NuxtLink
            :to="localePath('/')"
            class="flex-shrink-0 flex-1 font-bold text-xl flex flex-row items-center"
            :aria-label="`RootSocket Logo`"
          >
            <img
              src="/logo.png"
              class="h-6 max-w-full rounded-full"
              alt="RootSocket"
            />

            <span class="text-2xl ml-2">RootSocket</span>
          </NuxtLink>
        </div>
        <div class="lg:w-1/5 flex items-center pl-4 lg:pl-8 justify-end">
          <NuxtLink
            to="/"
            class="font-semibold leading-none text-gray-700 dark:text-gray-300 hover:text-primary-500 dark-hover:text-primary-500 text-base mr-7 hidden lg:block"
            exact-active-class="text-primary-500"
            >Applications</NuxtLink
          >
          <NuxtLink
            to="/"
            class="font-semibold leading-none text-gray-700 dark:text-gray-300 hover:text-primary-500 dark-hover:text-primary-500 text-base mr-7 hidden lg:block"
            exact-active-class="text-primary-500"
            >Billing</NuxtLink
          >
          <NuxtLink
            to="/"
            class="font-semibold leading-none text-gray-700 dark:text-gray-300 hover:text-primary-500 dark-hover:text-primary-500 text-base hidden lg:block"
            exact-active-class="text-primary-500"
            >Account</NuxtLink
          >
          <div class="flex items-center">
            <button
              class="lg:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 focus:outline-none -mr-2"
              aria-label="Menu"
              @click.stop="menu = !menu"
            >
              <IconX v-if="menu" class="w-5 h-5" />
              <IconMenu v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      scrolled: 0,
      settings: {
        layout: 'a',
      },
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
  },
  beforeMount() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.scrolled = window.scrollY > 0
    },
    scrollToTop() {
      if (window.innerWidth >= 1280) {
        return
      }
      window.scrollTo(0, 0)
    },
    noop() {},
  },
}
</script>
