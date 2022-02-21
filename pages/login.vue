<template>
  <div class="min-h-screen flex flex-col justify-center sm:py-12">
    <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
      <Logo class="mb-5" />
      <form
        class="bg-white border dark:bg-gray-900 dark:border-gray-800 shadow w-full rounded-lg divide-y divide-gray-200 dark:divide-gray-800 shadow"
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
          <div class="flex flex-row items-center justify-between pb-1">
            <TextLabel :value="$t('password')" />
            <NuxtLink
              :to="localeLocation({ name: 'forgot' })"
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
          <ButtonPressable
            :value="$t('login')"
            type="submit"
            class="w-full"
            variant="primary"
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
    }
  },
  head() {
    return {
      title: `${this.$t('login')} - ${this.$config.projectTitle}`,
    }
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
    "forgotPassword": "Forgot password?"
  },
  "es": {
    "email": "Correo electrónico",
    "password": "Contraseña",
    "enterEmailAddress": "Introduce el correo electrónico",
    "enterPassword": "Introduce la contraseña",
    "login": "Iniciar sesión",
    "createAccount": "Crear una cuenta",
    "forgotPassword": "Contraseña olvidada?"
  }
}
</i18n>
