<template>
  <div class="min-h-screen flex flex-col justify-center sm:py-12">
    <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
      <Logo class="mb-5" />
      <form
        class="bg-white border dark:bg-gray-900 dark:border-gray-800 shadow w-full rounded-lg"
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
          <ButtonPressable
            :value="$t('resetPassword')"
            type="submit"
            variant="primary"
            class="w-full"
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
  name: 'ResetPage',
  auth: false,
  data() {
    return {
      email: '',
    }
  },
  head(): { title: string } {
    return {
      title: `${this.$t('resetPassword')} - ${this.$config.projectTitle}`,
    }
  },
})
</script>

<i18n>
{
  "en": {
    "email": "Email address",
    "enterEmailAddress": "Enter email address",
    "resetPassword": "Reset password"
  },
  "es": {
    "email": "Correo electrónico",
    "enterEmailAddress": "Introduce el correo electrónico",
    "resetPassword": "Reiniciar contraseña"
  }
}
</i18n>
