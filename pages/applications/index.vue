<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <div class="flex flex-col md:flex-row justify-between md:items-center">
        <h1>{{ $t('applications') }}</h1>
        <ButtonPressable
          class="mb-8"
          variant="outline"
          :value="$t('createApplication')"
          @click="toggleShowCreateApplicationModal"
        />
      </div>

      <div v-for="organization in organizations" :key="organization.name">
        <p
          class="mb-2 text-gray-500 uppercase tracking-wider font-bold text-sm lg:text-xs"
        >
          {{ organization.name }}
        </p>
        <div class="grid grid-cols-1 gap-4">
          <div
            v-for="application in organization.applications"
            :key="application.identifier"
            class="w-full p-4 border dark:border-gray-800 rounded-md cursor-pointer hover:shadow-sm flex flex-row justify-between items-center"
            @click="navigateToApplication(application.identifier)"
          >
            <div class="flex-1 truncate mr-4">{{ application.name }}</div>
            <div class="flex flex-row items-center">
              <AppBadge :value="application.location" variant="default" />
              <AppBadge
                :value="$tc('keys', application.keys.length)"
                :variant="application.keys.length === 0 ? 'red' : 'green'"
                class="ml-2"
              />
            </div>
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
  auth: false,
  data() {
    return {
      createApplication: {
        name: '',
        region: '',
        showModal: false,
      },
      organizations: [
        {
          name: 'Invisen',
          applications: [
            {
              identifier: 'UUIDv7',
              name: 'Panorama Staging asdf asdfsa df sf dsafdsa f dsafdsa dsf a dsfaa wkl wfae feawjf alkf aekjlfa ejklaf jklfa wejlkfa wejklf eajklfa weljkf aweljk fewl',
              location: 'eu-west-1',
              keys: [
                {
                  token: 'string',
                  type: 'public/private',
                  hosts: [],
                  expires: 1645379187,
                },
                {
                  token: 'string',
                  type: 'public/private',
                  hosts: [],
                  expires: 1645379187,
                },
              ],
              allowClientSend: 'boolean',
              allowClientSubscription: 'boolean',
              allowAnalytics: 'boolean',
            },
            {
              identifier: 'UUIDv2117',
              name: 'Invisen not Staging',
              location: 'eu-west-1',
              keys: [],
              allowClientSend: 'boolean',
              allowClientSubscription: 'boolean',
              allowAnalytics: 'boolean',
            },
            {
              identifier: 'UUIDv2117',
              name: 'Invisen not Staging',
              location: 'eu-west-1',
              keys: [],
              allowClientSend: 'boolean',
              allowClientSubscription: 'boolean',
              allowAnalytics: 'boolean',
            },
            {
              identifier: 'UUIDv2117',
              name: 'Invisen not Staging',
              location: 'eu-west-1',
              keys: [],
              allowClientSend: 'boolean',
              allowClientSubscription: 'boolean',
              allowAnalytics: 'boolean',
            },
            {
              identifier: 'UUIDv2117',
              name: 'Invisen not Staging',
              location: 'eu-west-1',
              keys: [],
              allowClientSend: 'boolean',
              allowClientSubscription: 'boolean',
              allowAnalytics: 'boolean',
            },
            {
              identifier: 'UUIDv2117',
              name: 'Invisen not Staging',
              location: 'eu-west-1',
              keys: [],
              allowClientSend: 'boolean',
              allowClientSubscription: 'boolean',
              allowAnalytics: 'boolean',
            },
            {
              identifier: 'UUIDv2117',
              name: 'Invisen not Staging',
              location: 'eu-west-1',
              keys: [],
              allowClientSend: 'boolean',
              allowClientSubscription: 'boolean',
              allowAnalytics: 'boolean',
            },
          ],
        },
      ],
    }
  },
  head() {
    return {
      title: `${this.$t('applications')} - ${this.$config.projectTitle}`,
    }
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
    "selectRegion": "Select a region"
  },
  "es": {
    "applications": "Aplicaciones",
    "createApplication": "Crear aplicación",
    "keys": "Sin claves | Una clave | {count} claves",
    "applicationName": "Nombre de la aplicación",
    "enterName": "Introduce un nombre",
    "cancel": "Cancelar",
    "region": "Región",
    "selectRegion": "Selecciona una región"
  }
}
</i18n>
