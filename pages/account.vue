<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <h1>{{ $t('account') }}</h1>

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
          />
          <ButtonPressable
            :value="$t('edit')"
            variant="outline"
            type="button"
            class="ml-2"
          />
        </div>
      </div>
    </AppPage>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  layout: 'user',
  auth: false,
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
})
</script>

<i18n>
{
  "en": {
    "account": "Account",
    "leave": "Leave",
    "organizations": "Organizations",
    "edit": "Edit"
  },
  "es": {
    "account": "Cuenta",
    "leave": "Abandonar",
    "organizations": "Organizaciones",
    "edit": "Edit"
  }
}
</i18n>
