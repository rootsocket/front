<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <div class="flex flex-col md:flex-row justify-between md:items-center">
        <h1>{{ $t('account') }}</h1>
        <ButtonPressable
          class="mb-8"
          variant="outline"
          :value="$t('createOrganization')"
          @click="toggleShowCreateOrganization"
        />
      </div>

      <p class="text-gray-500 uppercase tracking-wider font-bold text-md">
        {{ $t('organizations') }}
      </p>

      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="organization in organizations"
          :key="organization.identifier"
          class="w-full p-4 border dark:border-gray-800 rounded-md flex flex-row justify-between items-center"
        >
          <span class="flex-1 truncate mr-2 text-lg">{{
            organization.name
          }}</span>

          <ButtonPressable
            :value="$t('leave')"
            variant="outline-red"
            type="button"
            @click="toggleShowLeaveOrganization"
          />
          <ButtonPressable
            :value="$t('edit')"
            variant="outline"
            type="button"
            class="ml-2"
            @click="
              showEditOrganization(organization.name, organization.identifier)
            "
          />
        </div>
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
            v-model="name"
            :placeholder="$t('enterEmail')"
            class="mt-1"
            type="email"
            margin
            required
          />
          <TextLabel :value="$t('yourPassword')" />
          <TextInput
            v-model="name"
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
            v-model="name"
            :placeholder="$t('enterNewPassword')"
            class="mt-1"
            margin
            required
          />
          <TextLabel :value="$t('confirmNewPassword')" />
          <TextInput
            v-model="name"
            :placeholder="$t('enterNewPassword')"
            class="mt-1"
            margin
            required
          />
          <TextLabel :value="$t('yourPassword')" />
          <TextInput
            v-model="name"
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
      :show="createOrganization.show"
      :title="$t('createOrganization')"
      @close="toggleShowCreateOrganization"
    >
      <form @submit.prevent="createOrganizationForm">
        <TextLabel :value="$t('organizationName')" />
        <TextInput
          v-model="createOrganization.name"
          :placeholder="$t('enterName')"
          margin
          required
        />
        <div class="w-full flex justify-end">
          <ButtonPressable
            :value="$t('cancel')"
            variant="outline"
            class="mr-2"
            type="button"
            @click="toggleShowCreateOrganization"
          />
          <ButtonPressable
            :value="$t('createOrganization')"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
    </AppModal>
    <AppModal
      :show="showLeaveOrganization"
      :title="$t('leaveOrganization')"
      @close="toggleShowLeaveOrganization"
    >
      <form @submit.prevent="leaveOrganizationForm">
        <span>{{ $t('leaveOrganizationDescription') }}</span>
        <div class="w-full flex justify-end mt-4">
          <ButtonPressable
            :value="$t('cancel')"
            variant="outline"
            class="mr-2"
            type="button"
            @click="toggleShowLeaveOrganization"
          />
          <ButtonPressable
            :value="$t('leaveOrganization')"
            variant="red"
            type="submit"
          />
        </div>
      </form>
    </AppModal>

    <AppModal
      :show="editOrganization.show"
      :title="$t('editOrganization')"
      @close="toggleShowEditOrganization"
    >
      <form @submit.prevent="editOrganizationForm">
        <TextLabel :value="$t('organizationName')" />
        <TextInput
          v-model="editOrganization.name"
          :placeholder="$t('enterName')"
          margin
          required
        />
        <input :value="editOrganization.identifier" required hidden />
        <div class="w-full flex justify-end">
          <ButtonPressable
            :value="$t('cancel')"
            variant="outline"
            class="mr-2"
            type="button"
            @click="toggleShowEditOrganization"
          />
          <ButtonPressable
            :value="$t('editOrganization')"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
    </AppModal>
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
      createOrganization: {
        name: '',
        show: false,
      },
      editOrganization: {
        name: '',
        identifier: '',
        show: false,
      },
      showLeaveOrganization: false,
      showDeleteAccount: false,
    }
  },
  head() {
    return {
      title: `${this.$t('account')} - ${this.$config.projectTitle}`,
    }
  },
  computed: {
    organizations() {
      return this.$store.state.application.organizations
    },
  },
  methods: {
    toggleShowCreateOrganization() {
      this.createOrganization.show = !this.createOrganization.show
      this.createOrganization.name = ''
    },
    toggleShowLeaveOrganization() {
      this.showLeaveOrganization = !this.showLeaveOrganization
    },
    toggleShowDeleteAccount() {
      this.showDeleteAccount = !this.showDeleteAccount
    },
    toggleShowEditOrganization() {
      this.editOrganization.show = !this.editOrganization.show
      this.editOrganization.name = ''
      this.editOrganization.identifier = ''
    },
    showEditOrganization(name: string, identifier: string) {
      this.editOrganization = {
        name,
        identifier,
        show: true,
      }
    },
    createOrganizationForm() {},
    editOrganizationForm() {},
    leaveOrganizationForm() {},
    deleteAccountForm() {},
  },
})
</script>

<i18n>
{
  "en": {
    "account": "Account",
    "leave": "Leave",
    "organizations": "Organizations",
    "edit": "Edit",
    "createOrganization": "Create organization",
    "organizationName": "Organization name",
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
    "deleteAccountDescription": "All organizations, applications, members, keys and connections will be permanently deleted",
    "personalInformation": "Personal information",
    "leaveOrganization": "Leave organization",
    "leaveOrganizationDescription": "All applications related to this organization will be removed from your account",
    "editOrganization": "Edit organization"
  },
  "es": {
    "account": "Cuenta",
    "leave": "Abandonar",
    "organizations": "Organizaciones",
    "edit": "Edit",
    "createOrganization": "Crear organización",
    "organizationName": "Nombre de la organización",
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
    "deleteAccountDescription": "Todas las organizaciones, aplicaciones, miembros, claves y conexiones serán eliminadas permanentemente",
    "personalInformation": "Información personal",
    "leaveOrganization": "Abandonar organización",
    "leaveOrganizationDescription": "Todas las aplicaciones relacionadas con esta organización serán eliminadas de tu cuenta",
    "editOrganization": "Editar organización"
  }
}
</i18n>
