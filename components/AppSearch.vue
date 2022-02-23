<template>
  <div class="w-full relative flex flex-col justify-between">
    <div
      class="w-full relative"
      @keydown.down="increment"
      @keydown.up="decrement"
      @keydown.enter="go"
    >
      <label for="search" class="sr-only">{{ $t('search') }}</label>
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <IconSearch class="h-5 w-5 text-gray-500" />
        </div>
        <input
          id="search"
          ref="search"
          v-model="q"
          class="block w-full pl-10 pr-3 py-2 truncate leading-5 placeholder-gray-500 border border-transparent text-gray-700 dark:text-white dark-focus:text-white focus:border-gray-300 dark-focus:border-gray-700 rounded-md focus:outline-none focus:bg-white dark-focus:bg-gray-900 bg-gray-50 dark:bg-gray-800"
          :class="{ 'rounded-b-none': focus && (searching || results.length) }"
          :placeholder="$t('placeholder')"
          type="search"
          autocomplete="off"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>
    </div>
    <ul
      v-show="focus && (searching || results.length)"
      class="z-10 absolute w-full flex-1 top-0 bg-white dark:bg-gray-900 rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden"
      :class="{ 'rounded-t-none': focus && (searching || results.length) }"
      style="margin-top: 37px"
    >
      <li v-if="searching && !results.length" class="px-4 py-2">
        {{ $t('searching') }}
      </li>
      <li
        v-for="(result, index) of results.slice(0, 6)"
        :key="result.identifier"
        @mouseenter="focusIndex = index"
        @mousedown="go"
      >
        <NuxtLink
          :to="
            localeLocation({
              name: 'applications-slug-debug',
              params: { slug: result.identifier },
            })
          "
          class="flex px-4 py-2 items-center leading-5 transition ease-in-out duration-150"
          :class="{
            'text-primary-500 bg-gray-200 dark:bg-gray-800':
              focusIndex === index,
          }"
          @click="focus = false"
        >
          {{ result.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      q: '',
      focus: false,
      focusIndex: -1,
      open: false,
      searching: false,
    }
  },
  computed: {
    results() {
      return this.$store.getters['application/applications']
    },
  },
  watch: {
    q(q) {
      this.focusIndex = -1
      if (!q) {
        this.searching = false
        this.$store.commit('application/setApplicationsFilter', { search: q })
        return
      }
      this.searching = true
      this.$store.commit('application/setApplicationsFilter', { search: q })
      this.searching = false
    },
  },
  mounted() {
    window.addEventListener('keyup', this.keyup)
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.keyup)
  },
  methods: {
    onFocus() {
      this.focus = true
      this.$emit('focus', true)
    },
    onBlur() {
      this.focus = false
      this.$emit('focus', false)
    },
    keyup(e) {
      if (e.key === '/') {
        this.$refs.search.focus()
      }
    },
    increment() {
      if (this.focusIndex < this.results.length - 1) {
        this.focusIndex++
      }
    },
    decrement() {
      if (this.focusIndex >= 0) {
        this.focusIndex--
      }
    },
    go() {
      if (this.results.length === 0) {
        return
      }
      const result =
        this.focusIndex === -1 ? this.results[0] : this.results[this.focusIndex]
      this.$router.push(
        this.localeLocation({
          name: 'applications-slug-debug',
          params: { slug: result.identifier },
        })
      )
      // Unfocus the input and reset the query.
      this.$refs.search.blur()
      this.q = ''
    },
  },
}
</script>

<i18n>
{
    "en": {
        "search": "Search",
        "placeholder": "Search applications (Press \"/\" to focus)",
        "searching": "Searching..."
    },
    "es": {
        "search": "Buscar",
        "placeholder": "Busca aplicaciones (Pulsa \"/\" para enfocar)",
        "searching": "Buscando..."
    }
}
</i18n>
