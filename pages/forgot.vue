<template>
  <div class="min-h-screen flex flex-col justify-center sm:py-12">
    <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
      <Logo class="mb-5" />
      <form
        v-if="!token"
        class="bg-white border dark:bg-gray-900 dark:border-gray-800 shadow w-full rounded-lg"
        @submit.prevent="reset"
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
          <vue-hcaptcha
            v-if="showCaptcha"
            ref="captcha"
            :sitekey="siteKey"
            :theme="$colorMode.preference"
            size="invisible"
            @verify="onVerify"
          ></vue-hcaptcha>
          <ButtonPressable
            :value="$t('resetPassword')"
            type="submit"
            variant="primary"
            class="w-full"
            :loading="loading"
          />
        </div>
      </form>
      <form
        v-else
        class="bg-white border dark:bg-gray-900 dark:border-gray-800 shadow w-full rounded-lg"
        @submit.prevent="resetConfirm"
      >
        <div class="px-5 py-7">
          <TextLabel :value="$t('newPassword')" />
          <TextInput
            v-model="newPassword"
            type="password"
            :placeholder="$t('enterNewPassword')"
            margin
            required
          />
          <TextLabel :value="$t('newPasswordConfirm')" />
          <TextInput
            v-model="newPasswordConfirm"
            type="password"
            :placeholder="$t('enterNewPassword')"
            margin
            required
          />
          <ButtonPressable
            :value="$t('resetPassword')"
            type="submit"
            variant="primary"
            class="w-full"
            :loading="loading"
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
  name: 'ForgotPage',
  auth: false,
  data() {
    return {
      email: this.$route.query.email,
      loading: false,
      newPassword: '',
      newPasswordConfirm: '',
    }
  },
  head(): { title: string } {
    return {
      title: `${this.$t('resetPassword')} - ${this.$config.projectTitle}`,
    }
  },
  computed: {
    siteKey() {
      return process.env.captchaSiteKey
    },
    token() {
      return this.$route.query.token
    },
    showCaptcha() {
      return this.$store.getters['captcha/isActive']
    },
  },
  methods: {
    reset() {
      if (this.showCaptcha) this.$refs.captcha.execute()
      else this.onVerify()
    },
    async onVerify(token = '') {
      if (this.email && (token || !this.showCaptcha)) {
        try {
          this.loading = true
          await this.$axios.post(
            `${process.env.apiUrl}api/v1/users/reset-password/`,
            { email: this.email, captcha: token }
          )
          this.$toast.show(this.$t('success'))
          this.$router.push(this.localePath({ name: 'login' }))
        } catch (e: any) {
          const err = e.response?.data?.detail ?? 'failedForgot'
          this.$toast.show(this.$t(err))
        } finally {
          this.loading = false
          this.$refs.captcha.reset()
          this.$store.commit('captcha/setCaptchaExpires')
        }
      }
    },
    async resetConfirm() {
      try {
        this.loading = true
        await this.$axios.post(
          `${process.env.apiUrl}api/v1/users/reset-password-confirm/`,
          { password: this.newPassword, token: this.token }
        )
        this.$auth.setUser({ email: this.email })
        this.$auth.$storage.setState('loggedIn', true)
        this.$router.push(this.localePath({ name: 'applications' }))
      } catch (e: any) {
        const err = e.response?.data?.detail ?? 'failedForgot'
        this.$toast.show(this.$t(err))
      } finally {
        this.loading = false
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
    "resetPassword": "Reset password",
    "failedForgot": "Unable to process your request",
    "success": "We sent you an email",
    "newPassword": "New password",
    "newPasswordConfirm": "New password confirm",
    "enterNewPassword": "Enter new password"
  },
  "es": {
    "email": "Correo electrónico",
    "enterEmailAddress": "Introduce el correo electrónico",
    "resetPassword": "Reiniciar contraseña",
    "failedForgot": "No hemos sido capaces de procesar tu solicitud",
    "success": "Te hemos enviado correo electrónico",
    "newPassword": "Nueva contraseña",
    "newPasswordConfirm": "Confirmación nueva contraseña",
    "enterNewPassword": "Introduce una nueva contraseña"
  }
}
</i18n>
