<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <div class="flex flex-col md:flex-row justify-between md:items-center">
        <h1>{{ $t('account') }}</h1>
        <ButtonPressable
          class="mb-8"
          variant="outline-red"
          :value="$t('logout')"
          @click="logout"
        />
      </div>
      <p class="text-gray-500 uppercase tracking-wider font-bold text-md">
        {{ $t('personalInformation') }}
      </p>

      <form
        class="border dark:border-gray-800 rounded-md mt-4 divide-y dark:divide-gray-800"
      >
        <div class="flex flex-col p-4">
          <TextLabel :value="$t('email')" />
          <TextInput
            v-model="email"
            :placeholder="$t('enterEmail')"
            class="mt-1"
            type="email"
            margin
            required
          />
          <TextLabel :value="$t('yourPassword')" />
          <TextInput
            v-model="currentPassword"
            :placeholder="$t('enterYourPassword')"
            class="mt-1"
            margin
            required
          />
        </div>
        <div class="w-full flex justify-end p-4">
          <ButtonPressable
            :value="$t('updateEmail')"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
      <form
        class="border dark:border-gray-800 rounded-md mt-4 divide-y dark:divide-gray-800"
      >
        <div class="flex flex-col p-4">
          <TextLabel :value="$t('newPassword')" />
          <TextInput
            v-model="newPassword"
            :placeholder="$t('enterNewPassword')"
            class="mt-1"
            margin
            required
          />
          <TextLabel :value="$t('confirmNewPassword')" />
          <TextInput
            v-model="newPasswordConfirm"
            :placeholder="$t('enterNewPassword')"
            class="mt-1"
            margin
            required
          />
          <TextLabel :value="$t('yourPassword')" />
          <TextInput
            v-model="currentPassword"
            :placeholder="$t('enterYourPassword')"
            class="mt-1"
            margin
            required
          />
        </div>
        <div class="w-full flex justify-end p-4">
          <ButtonPressable
            :value="$t('updatePassword')"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
      <div
        class="border border-red-300 dark:border-red-800 rounded-md mt-4 divide-y divide-gray-300 dark:divide-gray-800"
      >
        <div class="flex flex-col p-4">
          <span class="text-xl font-semibold">{{ $t('deleteAccount') }}</span>
          <span>{{ $t('deleteAccountDescription') }}</span>
        </div>

        <div class="w-full flex justify-end p-4">
          <ButtonPressable
            :value="$t('deleteAccount')"
            variant="red"
            type="button"
            @click="toggleShowDeleteAccount"
          />
        </div>
      </div>
    </AppPage>
    <AppModal
      :show="showDeleteAccount"
      :title="$t('deleteAccount')"
      @close="toggleShowDeleteAccount"
    >
      <form @submit.prevent="deleteAccountForm">
        <span>{{ $t('deleteAccountDescription') }}</span>
        <div class="w-full flex justify-end mt-4">
          <ButtonPressable
            :value="$t('cancel')"
            variant="outline"
            class="mr-2"
            type="button"
            @click="toggleShowDeleteAccount"
          />
          <ButtonPressable
            :value="$t('deleteAccount')"
            variant="red"
            type="submit"
          />
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  layout: 'user',
  auth: false,
  data() {
    return {
      showDeleteAccount: false,
      currentPassword: '',
      email: this.$auth.user?.email ?? '',
      newPassword: '',
      newPasswordConfirm: '',
    }
  },
  head() {
    return {
      title: `${this.$t('account')} - ${this.$config.projectTitle}`,
    }
  },
  methods: {
    toggleShowDeleteAccount() {
      this.showDeleteAccount = !this.showDeleteAccount
    },

    deleteAccountForm() {},
    logout() {
      this.$auth.logout()
      this.$router.push(this.localePath({ name: 'login' }))
    },
  },
})
</script>

<i18n>
{
  "en": {
    "account": "Account",
    "leave": "Leave",
    "edit": "Edit",
    "enterName": "Enter name",
    "cancel": "Cancel",
    "email": "Email",
    "enterEmail": "Enter an email address",
    "updateEmail": "Update email",
    "updatePassword": "Update password",
    "yourPassword": "Your password",
    "newPassword": "New passowrd",
    "confirmNewPassword": "Confirm new password",
    "enterYourPassword": "Enter your password",
    "enterNewPassword": "Enter new password",
    "deleteAccount": "Delete account",
    "deleteAccountDescription": "All applications, members, keys and connections will be permanently deleted",
    "personalInformation": "Personal information",
    "logout": "Log out"
  },
  "es": {
    "account": "Cuenta",
    "leave": "Abandonar",
    "edit": "Edit",
    "enterName": "Introduce un nombre",
    "cancel": "Cancelar",
    "email": "Correo electrónico",
    "enterEmail": "Introduce un correo electrónico",
    "updateEmail": "Actualizar correo electrónico",
    "updatePassword": "Actualizar contraseña",
    "yourPassword": "Tu contraseña",
    "newPassword": "Nueva contraseña",
    "confirmNewPassword": "Confirma tu nueva contraseña",
    "enterYourPassword": "Introduce tu contraseña",
    "enterNewPassword": "Introduce una nueva contraseña",
    "deleteAccount": "Eliminar cuenta",
    "deleteAccountDescription": "Todas las aplicaciones, miembros, claves y conexiones serán eliminadas permanentemente",
    "personalInformation": "Información personal",
    "logout": "Cerrar sesión"
  }
}
</i18n>
