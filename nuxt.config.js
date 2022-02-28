import pkg from './package.json'

const apiUrl = process.env.API_URL || 'http://localhost:8788/'
const captchaSiteKey =
  process.env.CAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001'

export default {
  env: {
    captchaSiteKey,
    apiUrl,
  },
  publicRuntimeConfig: {
    clientVersion: pkg.version,
    projectTitle: pkg.name,
    projectBlog: 'https://rootsocket.com/blog',
    projectDocs: 'https://rootsocket.com/docs',
  },
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'RootSocket',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Application to manage your RootSocket settings',
      },
      {
        hid: 'og:description',
        name: 'og:description',
        content: 'Application to manage your RootSocket settings',
      },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    bodyAttrs: {
      class:
        'antialiased text-gray-700 leading-normal bg-white dark:bg-gray-900 dark:text-gray-300',
    },
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/css/main.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/menu.client', '@/plugins/captcha.client'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxtjs/color-mode',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/auth-next',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/i18n',
    '@nuxtjs/toast',
  ],

  toast: {
    position: 'bottom-center',
    duration: 5000,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  i18n: {
    vueI18nLoader: true,
    locales: [
      { code: 'en', iso: 'en-US', name: 'English' },
      { code: 'es', iso: 'es-ES', name: 'Español' },
    ],
    fallbackLocale: 'en',
  },
  googleFonts: {
    families: {
      'DM+Sans': true,
      'DM+Mono': true,
    },
    download: true,
  },
  router: {
    middleware: ['auth'],
  },
  auth: {
    cookie: false,
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/',
    },
    plugins: ['~/plugins/auth.client.js'],
    strategies: {
      cookie: {
        localStorage: {
          maxAge: 60 * 60 * 24 * 365,
        },
        user: {
          autoFetch: false,
        },
        endpoints: {
          login: { url: `${apiUrl}api/v1/users/me/login/`, method: 'post' },
        },
      },
    },
  },
  generate: {
    fallback: '404.html',
  },
}
