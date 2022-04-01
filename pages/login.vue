<template>
  <div class="min-h-screen flex flex-col justify-center sm:py-12">
    <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
      <Logo class="mb-5" />
      <form
        class="bg-white border dark:bg-gray-900 dark:border-gray-800 shadow w-full rounded-lg divide-y divide-gray-200 dark:divide-gray-800 shadow"
        @submit.prevent="login"
      >
        <div class="px-5 py-7">
          <TextLabel :value="$t('email')" />
          <TextInput
            v-model="email"
            type="email"
            :placeholder="$t('enterEmailAddress')"
            margin
            required
          />
          <div class="flex flex-row items-center justify-between">
            <TextLabel :value="$t('password')" />
            <NuxtLink
              :to="localeLocation({ name: 'forgot' })"
              tabindex="-1"
              class="leading-none text-primary-500 text-xs"
              >{{ $t('forgotPassword') }}</NuxtLink
            >
          </div>
          <TextInput
            v-model="password"
            type="password"
            :placeholder="$t('enterPassword')"
            margin
            required
          />
          <vue-hcaptcha
            v-if="showCaptcha"
            ref="captcha"
            :sitekey="siteKey"
            :theme="$colorMode.preference"
            size="invisible"
            @verify="onVerify"
          ></vue-hcaptcha>
          <ButtonPressable
            :value="$t('login')"
            type="submit"
            class="w-full"
            variant="primary"
            :loading="loading"
          />
        </div>
        <div class="p-5">
          <ButtonPressable
            :value="$t('createAccount')"
            variant="outline"
            class="w-full"
            @click="$router.push(localeLocation({ name: 'register' }))"
          />
        </div>
      </form>
      <div class="flex items-center space-x-4 mt-4 justify-end">
        <AppLangSwitcher />
        <AppColorSwitcher />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LoginPage',
  auth: false,
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      showCaptcha: false,
    }
  },
  head() {
    return {
      title: `${this.$t('login')} - ${this.$config.projectTitle}`,
    }
  },
  computed: {
    siteKey() {
      return process.env.captchaSiteKey
    },
  },
  beforeMount() {
    if (this.$auth.loggedIn) {
      this.$router.push('/')
    }
  },
  methods: {
    login() {
      if (this.showCaptcha) this.$refs.captcha.execute()
      else this.onVerify()
    },
    async onVerify(token = '') {
      if (this.email && this.password && (token || !this.showCaptcha)) {
        try {
          this.loading = true
          await this.$auth.loginWith('local', {
            data: {
              email: this.email,
              password: this.password,
              captcha: token,
            },
          })
          this.$auth.setUser({ email: this.email })
          this.$auth.$storage.setState('loggedIn', true)
          this.$router.push(this.localePath({ name: 'applications' }))
        } catch (e: any) {
          const err = e.response?.data?.detail ?? 'failedLogin'
          this.$toast.show(this.$t(err))
          this.showCaptcha = true
        } finally {
          this.loading = false
          this.$refs.captcha.reset()
        }
      }
    },
  },
})
</script>

<i18n>
{
  "en": {
    "email": "Email address",
    "password": "Password",
    "enterEmailAddress": "Enter email address",
    "enterPassword": "Enter password",
    "login": "Login",
    "createAccount": "Create an account",
    "forgotPassword": "Forgot password?",
    "failedLogin": "Failed to login with provided credentials"
  },
  "es": {
    "email": "Correo electrónico",
    "password": "Contraseña",
    "enterEmailAddress": "Introduce el correo electrónico",
    "enterPassword": "Introduce la contraseña",
    "login": "Iniciar sesión",
    "createAccount": "Crear una cuenta",
    "forgotPassword": "Contraseña olvidada?",
    "failedLogin": "No se ha podido iniciar sesión con esas credenciales"
  }
}
</i18n>
