<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <div class="flex flex-col md:flex-row justify-between md:items-center">
        <h1>{{ $t('applications') }}</h1>
        <ButtonPressable
          v-if="applications.length !== 0"
          class="mb-8"
          variant="outline"
          :value="$t('createApplication')"
          @click="toggleShowCreateApplicationModal"
        />
      </div>
      <div
        v-if="applications.length === 0"
        class="w-full flex justify-center items-center"
      >
        <div class="flex flex-col items-center mt-10 mb-20">
          <div
            class="rounded-full h-20 w-20 flex flex-row items-center justify-center text-primary-500 bg-primary-100 dark:text-gray-100 dark:bg-gray-700"
          >
            <IconApplication class="h-14 w-14" />
          </div>
          <span class="my-4 w-60 text-center text-gray-600">
            {{ $t('noApplications') }}
          </span>
          <ButtonPressable
            variant="outline"
            :value="$t('createApplication')"
            @click="toggleShowCreateApplicationModal"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="application in applications"
          :key="application.identifier"
          class="w-full p-4 border dark:border-gray-800 rounded-md cursor-pointer hover:shadow-sm flex flex-col lg:flex-row justify-between lg:items-center"
          @click="navigateToApplication(application.identifier)"
        >
          <div class="flex-1 truncate mr-4">{{ application.name }}</div>
          <div class="flex flex-row items-center mt-2 lg:mt-0">
            <AppBadge :value="application.location" variant="default" />
            <AppBadge
              :value="$tc('keys', application.keys.length)"
              :variant="application.keys.length === 0 ? 'red' : 'green'"
              class="ml-2"
            />
          </div>
        </div>
      </div>
    </AppPage>
    <AppModal
      :show="createApplication.showModal"
      :title="$t('createApplication')"
      @close="toggleShowCreateApplicationModal"
    >
      <form @submit.prevent="createApplicationForm">
        <TextLabel :value="$t('applicationName')" />
        <TextInput
          v-model="createApplication.name"
          :placeholder="$t('enterName')"
          margin
          required
        />
        <TextLabel :value="$t('region')" />
        <TextSelect
          v-model="createApplication.region"
          :placeholder="$t('selectRegion')"
          :options="[
            { value: 'eu-west-1', text: 'eu-west-1' },
            { value: 'us-west-2', text: 'us-west-2' },
          ]"
          required
        />
        <div class="w-full flex justify-end">
          <ButtonPressable
            :value="$t('cancel')"
            variant="outline"
            class="mr-2"
            type="button"
            @click="toggleShowCreateApplicationModal"
          />
          <ButtonPressable
            :value="$t('createApplication')"
            variant="primary"
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
  data() {
    return {
      createApplication: {
        name: '',
        region: '',
        showModal: false,
      },
    }
  },
  head() {
    return {
      title: `${this.$t('applications')} - ${this.$config.projectTitle}`,
    }
  },
  computed: {
    applications() {
      return this.$store.state.application.applications
    },
  },
  methods: {
    navigateToApplication(appIdentifier: string) {
      this.$router.push(
        this.localeLocation({
          name: 'applications-slug-debug',
          params: { slug: appIdentifier },
        })
      )
    },
    toggleShowCreateApplicationModal() {
      this.createApplication.showModal = !this.createApplication.showModal
      this.createApplication.name = ''
      this.createApplication.region = ''
    },
    createApplicationForm() {},
  },
})
</script>

<i18n>
{
  "en": {
    "applications": "Applications",
    "createApplication": "Create application",
    "keys": "No keys | One key | {count} keys",
    "applicationName": "Application name",
    "enterName": "Enter a name",
    "cancel": "Cancel",
    "region": "Region",
    "selectRegion": "Select a region",
    "noApplications": "There are no applications available for this account"
  },
  "es": {
    "applications": "Aplicaciones",
    "createApplication": "Crear aplicación",
    "keys": "Sin claves | Una clave | {count} claves",
    "applicationName": "Nombre de la aplicación",
    "enterName": "Introduce un nombre",
    "cancel": "Cancelar",
    "region": "Región",
    "selectRegion": "Selecciona una región",
    "noApplications": "No hay aplicaciones disponibles para esta cuenta"
  }
}
</i18n>
