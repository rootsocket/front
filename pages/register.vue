<template>
  <div class="min-h-screen flex flex-col justify-center sm:py-12">
    <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
      <Logo class="mb-5" />
      <form
        class="bg-white border dark:bg-gray-900 dark:border-gray-800 shadow w-full rounded-lg divide-y divide-gray-200 dark:divide-gray-800"
        @submit.prevent="register"
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
          <TextLabel :value="$t('password')" />
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
            :value="$t('createAccount')"
            type="submit"
            variant="primary"
            class="w-full"
            :loading="loading"
          />
        </div>
        <div class="p-5">
          <ButtonPressable
            :value="$t('login')"
            variant="outline"
            class="w-full"
            @click="$router.push(localeLocation({ name: 'login' }))"
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
  name: 'RegisterPage',
  auth: false,
  data() {
    return {
      email: '',
      password: '',
      loading: false,
    }
  },
  head(): { title: string } {
    return {
      title: `${this.$t('createAccount')} - ${this.$config.projectTitle}`,
    }
  },
  computed: {
    siteKey() {
      return process.env.captchaSiteKey
    },
    showCaptcha() {
      return this.$store.getters['captcha/isActive']
    },
  },
  methods: {
    register() {
      // if (this.showCaptcha) this.$refs.captcha.execute()
      // else this.onVerify()
      this.onVerify()
    },
    async onVerify(token = '') {
      if (this.email && this.password && (token || !this.showCaptcha)) {
        try {
          this.loading = true
          await this.$store.dispatch('application/registerAccount', {
            email: this.email,
            password: this.password,
            captcha: token,
          })
          this.$auth.setUser({ email: this.email })
          this.$auth.$storage.setState('loggedIn', true)
          this.$router.push(this.localePath({ name: 'applications' }))
        } catch (e: any) {
          const err = e.response?.data?.detail ?? 'failedRegister'
          this.$toast.show(this.$t(err))
        } finally {
          this.loading = false
          if (this.$refs.captcha) {
            this.$refs.captcha.reset()
          }
          this.$store.commit('captcha/setCaptchaExpires')
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
    "enterEmailAddress": "Enter email address",
    "login": "Login",
    "createAccount": "Create an account",
    "enterPassword": "Enter password",
    "password": "Password",
    "failedRegister": "We were unable to create an account"
  },
  "es": {
    "email": "Correo electrónico",
    "enterEmailAddress": "Introduce el correo electrónico",
    "login": "Iniciar sesión",
    "createAccount": "Crear una cuenta",
    "enterPassword": "Introduce una contraseña",
    "password": "Contraseña",
    "failedRegister": "No se ha podido crear la cuenta"
  }
}
</i18n>
