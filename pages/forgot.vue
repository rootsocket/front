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
        @submit.prevent="reset"
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
          <vue-hcaptcha
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
      email: '',
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
  },
  methods: {
    reset() {
      this.$refs.captcha.execute()
    },
    async onVerify(token: string) {
      if (this.token) {
        try {
          this.loading = true
          const response = await this.$axios.post(
            `${process.env.apiUrl}api/v1/users/me/reset-confirm/`,
            { password: this.newPassword, token: this.token, captcha: token }
          )
          this.$auth.setUser(response.data)
          this.$auth.$storage.setState('loggedIn', true)
          this.$router.push(this.localePath({ name: 'applications' }))
        } catch (e: any) {
          const err = e.response?.data?.detail ?? 'failedForgot'
          this.$toast.show(this.$t(err))
        } finally {
          this.loading = false
          this.$refs.captcha.reset()
        }
        return
      }

      if (this.email && token) {
        try {
          this.loading = true
          await this.$axios.post(
            `${process.env.apiUrl}api/v1/users/me/reset/`,
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
    "resetPassword": "Reset password",
    "failedForgot": "Unable to process your request",
    "success": "Success! If you have an account with us you should receive an email",
    "newPassword": "New password",
    "newPasswordConfirm": "New password confirm",
    "enterNewPassword": "Enter new password"
  },
  "es": {
    "email": "Correo electrónico",
    "enterEmailAddress": "Introduce el correo electrónico",
    "resetPassword": "Reiniciar contraseña",
    "failedForgot": "No hemos sido capaces de procesar tu solicitud",
    "success": "Hecho! Si tienes una cuenta con nosotros deberías recibir un correo electrónico",
    "newPassword": "Nueva contraseña",
    "newPasswordConfirm": "Confirmación nueva contraseña",
    "enterNewPassword": "Introduce una nueva contraseña"
  }
}
</i18n>
