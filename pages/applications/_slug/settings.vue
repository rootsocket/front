<template>
  <div
    class="flex flex-wrap-reverse"
    @keydown.esc="toggleShowDeleteApplication"
  >
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
        <div class="flex flex-row flex-wrap items-center">
          <span class="mr-4">{{ application.identifier }}</span>
          <ButtonPressable
            :value="$t('copy')"
            variant="outline"
            @click="copyIdentifier"
          />
        </div>
      </div>
      <form
        class="border dark:border-gray-800 rounded-md mt-4 divide-y dark:divide-gray-800"
        @submit.prevent="updateApplication"
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
            v-model="allowClientData"
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
            v-model="allowChannelSubscription"
            :label="$t('allowClientSubscription')"
            class="mt-4"
          />
          <AppToggle
            v-model="allowChannelAuthorization"
            :label="$t('allowChannelAuthorization')"
            class="mt-4"
          />
        </div>
        <div class="w-full flex justify-end p-4">
          <ButtonPressable
            :value="$t('updateApplication')"
            variant="primary"
            type="submit"
            :loading="loadingUpdate"
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
            type="button"
            :disabled="!isApplicationOwner"
            @click="toggleShowDeleteApplication"
          />
        </div>
      </div>
    </AppPage>

    <AppModal
      :show="showDeleteApplication"
      :title="$t('deleteApplication')"
      @close="toggleShowDeleteApplication"
    >
      <form @submit.prevent="deleteApplicationForm">
        <span>{{ $t('deleteApplicationDescription') }}</span>
        <div class="w-full flex justify-end mt-4">
          <ButtonPressable
            :value="$t('cancel')"
            variant="outline"
            class="mr-2"
            type="button"
            @click="toggleShowDeleteApplication"
          />
          <ButtonPressable
            :value="$t('deleteApplication')"
            variant="red"
            type="button"
            :loading="loadingDelete"
            @click="deleteApplicationForm"
          />
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getCurrentApplication } from '@/utils/application'
import { UserRole } from '~/types/application'
import { getErrorMessage } from '~/utils/error'

export default Vue.extend({
  layout: 'application',
  data() {
    return {
      name: '',
      allowClientSend: false,
      allowClientData: false,
      allowChannelSubscription: false,
      allowChannelAuthorization: false,
      showDeleteApplication: false,
      loadingUpdate: false,
      loadingDelete: false,
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
    isApplicationOwner() {
      return getCurrentApplication(
        this.$store.state,
        this.$route.params.slug
      ).members?.some(
        (i) => i.email === this.$auth.user?.email && i.role === UserRole.owner
      )
    },
  },
  watch: {
    allowChannelSubscription(newAllowChannelSubscription: boolean) {
      if (!newAllowChannelSubscription) {
        this.allowChannelAuthorization = false
      }
    },
  },
  mounted() {
    this.name = this.application.name
    this.allowClientSend = this.application.allowClientSend
    this.allowClientData = this.application.allowClientData
    this.allowChannelSubscription = this.application.allowChannelSubscription
    this.allowChannelAuthorization = this.application.allowChannelAuthorization
  },
  methods: {
    copyIdentifier() {
      navigator.clipboard.writeText(this.application.identifier)
      this.$toast.show(this.$t('copiedIdentifier'))
    },
    async updateApplication() {
      try {
        this.loadingUpdate = true
        await this.$store.dispatch('application/updateApplication', {
          identifier: this.application.identifier,
          name: this.name,
          allowClientSend: this.allowClientSend,
          allowClientData: this.allowClientData,
          allowChannelSubscription: this.allowChannelSubscription,
          allowChannelAuthorization: this.allowChannelAuthorization,
        })
        this.$toast.show(this.$t('success'))
      } catch (e) {
        this.$toast.show(getErrorMessage(e))
      } finally {
        this.loadingUpdate = false
      }
    },
    toggleShowDeleteApplication() {
      this.showDeleteApplication = !this.showDeleteApplication
    },
    async deleteApplicationForm() {
      try {
        this.loadingDelete = true
        await this.$store.dispatch('application/deleteApplication', {
          identifier: this.application.identifier,
        })
        this.$router.push(
          this.localeLocation({
            name: 'applications',
          })
        )
      } catch {
      } finally {
        this.loadingDelete = false
      }
    },
  },
})
</script>

<i18n>
{
  "en": {
    "cancel": "Cancel",
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
    "allowClientSubscription": "Allow client connections to subscribe to a channel",
    "allowAnalytics": "Allow client connections analytics",
    "clientSend": "Messages",
    "clientSendDescription": "Enables the client connection to send messages to other connections, if disabled connections can only receive messages",
    "clientSubscription": "Subscriptions",
    "allowChannelAuthorization": "Require clients to send an authentication token for every subscription",
    "clientSubscriptionDescription": "Enables subscription to channels from a client connection with or without authorization, if disabled you have to subscribe clients to a channel through the API",
    "updateApplication": "Update application",
    "deleteApplication": "Delete application",
    "deleteApplicationDescription": "All members, keys, connections and information related to this application will be permanently deleted and you won't be able to recover it",
    "copiedIdentifier": "Copied application identifier",
    "success": "Application updated successfully"
  },
  "es": {
    "cancel": "Cancelar",
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
    "allowChannelAuthorization": "Requerir a los clientes enviar un token de autorización con cada suscripción",
    "clientSubscriptionDescription": "Habilita la suscripción a un canal desde una conexión de cliente con o sin autorización, si está deshabilitada tendrás que suscribir la conexión a canales a través de la API",
    "updateApplication": "Actualizar aplicación",
    "deleteApplication": "Eliminar aplicación",
    "deleteApplicationDescription": "Todos los miembros, claves, conexiones e información relacionada con esta aplicación será eliminada de forma permanente y no se podrá recuperar",
    "copiedIdentifier": "Copiado el identificador de la aplicación",
    "success": "Aplicación actualizada con éxito"
  }
}
</i18n>
