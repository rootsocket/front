<template>
  <!-- component -->
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
    <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
      <RootSocketLogo class="mb-5" />
      <form class="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
        <div class="px-5 py-7">
          <TextLabel :value="$t('email')" />
          <TextInput
            v-model="email"
            type="email"
            :placeholder="$t('enterEmailAddress')"
            required
          />
          <ButtonPressable
            :value="$t('createAccount')"
            type="submit"
            variant="primary"
          />
        </div>
        <div class="p-5">
          <ButtonPressable
            :value="$t('login')"
            variant="outline"
            @click="$router.push(localePath('/login'))"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'RegisterPage',
  auth: false,
  data() {
    return {
      email: '',
    }
  },
}
</script>

<i18n>
{
  "en": {
    "email": "Email address",
    "enterEmailAddress": "Enter email address",
    "login": "Login",
    "createAccount": "Create an account"
  },
  "es": {
    "email": "Correo electrónico",
    "enterEmailAddress": "Introduce el correo electrónico",
    "login": "Iniciar sesión",
    "createAccount": "Crear una cuenta"
  }
}
</i18n>
