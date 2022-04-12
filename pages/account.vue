<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <div class="flex flex-col md:flex-row justify-between md:items-center">
        <h1>{{ $t('account') }}</h1>
        <ButtonPressable
          class="mb-7"
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
        @submit.prevent="updateAccountForm"
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
            type="password"
            margin
            required
          />
        </div>
        <div class="w-full flex justify-end p-4">
          <ButtonPressable
            :value="$t('updateEmail')"
            variant="primary"
            type="submit"
            :loading="loading"
          />
        </div>
      </form>
      <form
        class="border dark:border-gray-800 rounded-md mt-4 divide-y dark:divide-gray-800"
        @submit.prevent="updateAccountForm('password')"
      >
        <div class="flex flex-col p-4">
          <TextLabel :value="$t('newPassword')" />
          <TextInput
            v-model="newPassword"
            :placeholder="$t('enterNewPassword')"
            class="mt-1"
            type="password"
            margin
            required
          />
          <TextLabel :value="$t('confirmNewPassword')" />
          <TextInput
            v-model="newPasswordConfirm"
            :placeholder="$t('enterNewPassword')"
            class="mt-1"
            type="password"
            margin
            required
          />
          <TextLabel :value="$t('yourPassword')" />
          <TextInput
            v-model="currentPassword"
            :placeholder="$t('enterYourPassword')"
            class="mt-1"
            type="password"
            margin
            required
          />
        </div>
        <div class="w-full flex justify-end p-4">
          <ButtonPressable
            :value="$t('updatePassword')"
            variant="primary"
            type="submit"
            :disabled="newPassword !== newPasswordConfirm"
            :loading="loading"
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
        <TextLabel :value="$t('yourPassword')" class="mt-6" />
        <TextInput
          v-model="currentPassword"
          :placeholder="$t('enterYourPassword')"
          class="mt-1"
          type="password"
          margin
          required
        />
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
            :loading="loading"
          />
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getErrorMessage } from '~/utils/error'
export default Vue.extend({
  layout: 'user',
  data() {
    return {
      showDeleteAccount: false,
      currentPassword: '',
      email: this.$auth.user?.email ?? '',
      newPassword: '',
      newPasswordConfirm: '',
      loading: false,
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
    async updateAccountForm(type = 'password') {
      try {
        this.loading = true
        if (type === 'password') {
          await this.$store.dispatch('application/updateAccount', {
            currentPassword: this.currentPassword,
            password: this.newPassword,
          })
          this.newPassword = ''
          this.newPasswordConfirm = ''
        } else {
          await this.$store.dispatch('application/updateAccount', {
            email: this.email,
            currentPassword: this.currentPassword,
          })
        }
        this.currentPassword = ''

        this.$toast.show(this.$t('success'))
      } catch (e) {
        this.$toast.show(getErrorMessage(e))
      } finally {
        this.loading = false
      }
    },
    async deleteAccountForm() {
      try {
        this.loading = true
        await this.$store.dispatch('application/updateAccount', {
          currentPassword: this.currentPassword,
          delete: true,
        })
        this.$toast.show(this.$t('deleteSentEmail'))
        this.logout()
      } catch (e) {
        this.$toast.show(getErrorMessage(e))
      } finally {
        this.loading = false
      }
    },
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
    "newPassword": "New password",
    "confirmNewPassword": "Confirm new password",
    "enterYourPassword": "Enter your password",
    "enterNewPassword": "Enter new password",
    "deleteAccount": "Delete account",
    "deleteAccountDescription": "All applications, members, keys and connections will be permanently deleted in a month. If you log in again your account will be reactivated",
    "personalInformation": "Personal information",
    "logout": "Log out",
    "deleteSentEmail": "We sent you an email with more details",
    "success": "Account updated successfully"
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
    "deleteAccountDescription": "Todas las aplicaciones, miembros, claves y conexiones serán eliminadas permanentemente en un mes. Si inicias sesión de nuevo, tu cuenta será reactivada",
    "personalInformation": "Información personal",
    "logout": "Cerrar sesión",
    "deleteSentEmail": "Te hemos enviado un email con más detalles",
    "success": "Cuenta actualizada con éxito"
  }
}
</i18n>
