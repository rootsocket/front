<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <h1>{{ $t('settings') }}</h1>

      <div class="w-full mr-4 h-62 border dark:border-gray-800 rounded-md p-4">
        <TextLabel :value="$t('createdAt')" />
        <span>{{
          new Date(application.createdAt).toLocaleString('default', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        }}</span>
        <TextLabel :value="$t('region')" class="mt-4" />
        <span>{{ application.region }}</span>
        <TextLabel :value="$t('applicationIdentifier')" class="mt-4" />
        <div class="flex flex-row items-center">
          <span class="">{{ application.identifier }}</span>
          <ButtonPressable
            class="ml-4"
            :value="$t('copy')"
            variant="outline"
            @click="copyIdentifier"
          />
        </div>
      </div>
      <form
        class="border dark:border-gray-800 rounded-md mt-4 divide-y dark:divide-gray-800"
      >
        <div class="flex flex-col p-4">
          <TextLabel :value="$t('applicationName')" />
          <TextInput
            v-model="name"
            :placeholder="$t('enterName')"
            class="mt-1"
            required
          />
        </div>
        <div class="flex flex-col p-4">
          <span class="text-xl font-semibold">{{ $t('analytics') }}</span>
          <span>{{ $t('analyticsDescription') }}</span>
          <AppToggle
            v-model="allowAnalytics"
            :label="$t('allowAnalytics')"
            class="mt-4"
          />
        </div>
        <div class="flex flex-col p-4">
          <span class="text-xl font-semibold">{{ $t('clientSend') }}</span>
          <span>{{ $t('clientSendDescription') }}</span>
          <AppToggle
            v-model="allowClientSend"
            :label="$t('allowClientSend')"
            class="mt-4"
          />
        </div>
        <div class="flex flex-col p-4">
          <span class="text-xl font-semibold">{{
            $t('clientSubscription')
          }}</span>
          <span>{{ $t('clientSubscriptionDescription') }}</span>
          <AppToggle
            v-model="allowClientSubscription"
            :label="$t('allowClientSubscription')"
            class="mt-4"
          />
        </div>
        <div class="w-full flex justify-end p-4">
          <ButtonPressable
            :value="$t('updateApplication')"
            variant="primary"
            type="submit"
          />
        </div>
      </form>
      <div
        class="border border-red-300 dark:border-red-800 rounded-md mt-4 divide-y divide-gray-300 dark:divide-gray-800"
      >
        <div class="flex flex-col p-4">
          <span class="text-xl font-semibold">{{
            $t('deleteApplication')
          }}</span>
          <span>{{ $t('deleteApplicationDescription') }}</span>
        </div>

        <div class="w-full flex justify-end p-4">
          <ButtonPressable
            :value="$t('deleteApplication')"
            variant="red"
            type="submit"
          />
        </div>
      </div>
    </AppPage>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCurrentApplication } from '@/utils/application'

export default Vue.extend({
  layout: 'application',
  data() {
    return {
      name: '',
      allowClientSend: false,
      allowAnalytics: false,
      allowClientSubscription: false,
    }
  },
  head() {
    return {
      title: `${this.$t('settings')} - ${this.$config.projectTitle}`,
    }
  },
  computed: {
    application() {
      return getCurrentApplication(this.$store.state, this.$route.params.slug)
    },
  },
  mounted() {
    this.name = this.application.name
    this.allowClientSend = this.application.allowClientSend
    this.allowAnalytics = this.application.allowAnalytics
    this.allowClientSubscription = this.application.allowClientSubscription
  },
  methods: {
    copyIdentifier() {
      navigator.clipboard.writeText(this.application.identifier)
      this.$toast.show(this.$t('copiedIdentifier'))
    },
  },
})
</script>

<i18n>
{
  "en": {
    "settings": "Settings",
    "applicationName": "Application name",
    "enterName": "Enter name",
    "applicationIdentifier": "Application identifier",
    "updateName": "Update name",
    "region": "Region",
    "createdAt": "Creation date",
    "analytics": "Analytics",
    "analyticsDescription": "It will allow to visualize IP Address and User Agent information",
    "copy": "Copy",
    "allowClientSend": "Allow client connections to send messages",
    "allowClientSubscription": "Allow client connections to subscribe to channels",
    "allowAnalytics": "Allow connections analytics",
    "clientSend": "Messages",
    "clientSendDescription": "Enables the client connection to send messages to other connections, if disabled connections can only receive messages",
    "clientSubscription": "Subscriptions",
    "clientSubscriptionDescription": "Enables subscription to channels from a client connection, if disabled you have to subscribe clients to a channel through the API",
    "updateApplication": "Update application",
    "deleteApplication": "Delete application",
    "deleteApplicationDescription": "All members, keys, connections and information related to this application will be permanently deleted and you won't be able to recover it",
    "copiedIdentifier": "Copied application identifier"
  },
  "es": {
    "settings": "Ajustes",
    "applicationName": "Nombre de la aplicación",
    "enterName": "Introduce el nombre",
    "applicationIdentifier": "Identificador de la aplicación",
    "updateName": "Actualizar nombre",
    "region": "Región",
    "createdAt": "Fecha de creación",
    "analytics": "Analíticas",
    "analyticsDescription": "Permitirá visualizar información sobre el cliente como su dirección IP y el navegador usado",
    "copy": "Copiar",
    "allowClientSend": "Permitir enviar mensajes desde las conexiones en clientes",
    "allowClientSubscription": "Permitir la suscripción a canales desde conexiones en clientes",
    "allowAnalytics": "Permitir analíticas de conexiones",
    "clientSend": "Mensajes",
    "clientSendDescription": "Habilita el envío de mensajes a otras conexiones desde una conexión de cliente, si está deshabilitada las conexiones solo podrán recibir mensajes",
    "clientSubscription": "Suscripciones",
    "clientSubscriptionDescription": "Habilita la suscripción a un canal desde una conexión de cliente, si está deshabilitada tendrás que suscribir la conexión a canales a través de la API",
    "updateApplication": "Actualizar aplicación",
    "deleteApplication": "Eliminar aplicación",
    "deleteApplicationDescription": "Todos los miembros, claves, conexiones e información relacionada con esta aplicación será eliminada de forma permanente y no se podrá recuperar",
    "copiedIdentifier": "Copiado el identificador de la aplicación"
  }
}
</i18n>
