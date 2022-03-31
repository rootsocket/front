<template>
  <div class="min-h-screen flex flex-col justify-center sm:py-12">
    <div class="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
      <Logo class="mb-5" />
      <form
        class="bg-white border dark:bg-gray-900 dark:border-gray-800 shadow w-full rounded-lg divide-y divide-gray-200 dark:divide-gray-800 shadow"
        @submit.prevent="accept"
      >
        <div class="px-5 py-7">
          <TextLabel :value="$t('description')" />
          <ButtonPressable
            :value="$t('accept', { name })"
            type="submit"
            class="w-full mt-4"
            variant="primary"
            :loading="loading"
          />
        </div>
        <div class="p-5">
          <ButtonPressable
            :value="$t('cancel')"
            variant="outline"
            class="w-full"
            @click="$router.push(localeLocation({ path: '/' }))"
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
import { getErrorMessage } from '~/utils/error'

export default Vue.extend({
  name: 'Invitation',
  auth: true,
  data() {
    return {
      loading: false,
    }
  },
  head() {
    return {
      title: `${this.$t('Invitation') || (this as any).name} - ${
        this.$config.projectTitle
      }`,
    }
  },
  computed: {
    token() {
      return this.$route.query.token
    },
    name() {
      return this.$route.query.name
    },
    applicationIdentifier() {
      return this.$route.query.application
    },
  },
  methods: {
    async accept() {
      try {
        this.loading = true
        await this.$store.dispatch('application/acceptInvitation', {
          identifier: this.applicationIdentifier,
          token: this.token,
        })
        this.$router.push(
          this.localeLocation({
            name: 'applications',
          })
        )
      } catch (e) {
        this.$toast.show(getErrorMessage(e))
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
    "invitation": "Invitation",
    "accept": "Accept invitation to {name}",
    "cancel": "Cancel",
    "description": "You have been invited to participate as a member of an application"
  },
  "es": {
    "invitation": "Invitación",
    "accept": "Aceptar invitación a {name}",
    "cancel": "Cancelar",
    "description": "Has sido invitado a participar como miembro de una aplicación"
  }
}
</i18n>
