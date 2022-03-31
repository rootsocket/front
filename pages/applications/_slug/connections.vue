<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <h1>{{ $t('connections') }}</h1>

      <div
        v-if="connections.length === 0"
        class="w-full flex justify-center items-center"
      >
        <div class="flex flex-col items-center mt-10 mb-20">
          <div
            class="rounded-full h-20 w-20 flex flex-row items-center justify-center text-primary-500 bg-primary-100 dark:text-gray-100 dark:bg-gray-700"
          >
            <IconSensor class="h-14 w-14" />
          </div>
          <span class="my-4 w-60 text-center text-gray-600">
            {{ $t('noConnections') }}
          </span>
          <ButtonPressable variant="outline" :value="$t('readMore')" />
        </div>
      </div>

      <p
        v-if="connections.length !== 0"
        class="text-gray-500 uppercase tracking-wider font-bold text-md"
      >
        {{ $t('active') }}
      </p>
      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="connection in connections"
          :key="connection.identifier"
          class="w-full border dark:border-gray-800 rounded-md hover:shadow-sm flex flex-col items-start divide-y dark:divide-gray-800"
        >
          <div
            class="flex flex-row justify-between items-center w-full p-2 px-4 pt-3"
          >
            <span>{{ connection.identifier }}</span>
            <AppDropdown class="inline-flex ml-4">
              <template #trigger="{ open, toggle }">
                <button
                  class="rounded-md hover:text-primary-500 focus:outline-none"
                  :class="{ 'opacity-0': open }"
                  @touchstart.stop.prevent="toggle"
                >
                  <div class="inline-flex items-center">
                    <span>{{ $t('actions') }}</span>
                    <IconDropdown class="w-6 h-6" />
                  </div>
                </button>
              </template>

              <ul class="px-4">
                <span
                  class="flex text-red-400 items-center leading-8 whitespace-nowrap cursor-pointer"
                  @click="setDisconnectConnection(connection.identifier)"
                >
                  {{ $t('disconnectConnection') }}
                </span>
                <span
                  class="flex items-center hover:text-primary-500 leading-8 whitespace-nowrap cursor-pointer"
                  @click="setSubscribeChannel(connection.identifier)"
                >
                  {{ $t('subscribeChannel') }}
                </span>
                <span
                  class="flex items-center hover:text-primary-500 leading-8 whitespace-nowrap cursor-pointer"
                  @click="copyIdentifier(connection.identifier)"
                >
                  {{ $t('copyIdentifier') }}
                </span>
              </ul>
            </AppDropdown>
          </div>
          <div class="flex flex-row mt-2 overflow-x-auto w-full p-4">
            <AppBadge
              :value="`${$t('ip')} ${connection.ipAddress}`"
              variant="default"
              class="mr-2 whitespace-nowrap"
            />
            <AppBadge
              :value="connection.userAgent"
              variant="default"
              class="mr-2 whitespace-nowrap"
            />
            <AppBadge
              :value="`${connection.finishAt - connection.startAt} ${$t(
                'minutes'
              )}`"
              variant="default"
              class="mr-2 whitespace-nowrap"
            />
          </div>
        </div>
      </div>
    </AppPage>

    <AppModal
      :show="disconnectConnection.show"
      :title="$t('disconnectConnection')"
      @close="toggleShowDisconnectConnection"
    >
      <form @submit.prevent="disconnectConnectionForm">
        <span>{{
          $t('disconnectConnectionDescription', {
            identifier: disconnectConnection.identifier,
          })
        }}</span>

        <div class="w-full flex justify-end mt-4">
          <ButtonPressable
            :value="$t('cancel')"
            variant="outline"
            class="mr-2"
            type="button"
            @click="toggleShowDisconnectConnection"
          />
          <ButtonPressable
            :value="$t('disconnectConnection')"
            variant="red"
            type="submit"
          />
        </div>
      </form>
    </AppModal>
    <AppModal
      :show="subscribeChannel.show"
      :title="$t('subscribeChannel')"
      @close="toggleShowSubscribeChannel"
    >
      <form @submit.prevent="subscribeChannelForm">
        <TextLabel :value="$t('channelName')" />
        <TextInput
          v-model="subscribeChannel.channel"
          :placeholder="$t('enterName')"
          margin
          required
        />

        <div class="w-full flex justify-end mt-4">
          <ButtonPressable
            :value="$t('cancel')"
            variant="outline"
            class="mr-2"
            type="button"
            @click="toggleShowSubscribeChannel"
          />
          <ButtonPressable
            :value="$t('subscribeChannel')"
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
import { getCurrentApplication } from '@/utils/application'

export default Vue.extend({
  layout: 'application',
  data() {
    return {
      subscribeChannel: {
        identifier: '',
        channel: '',
        show: false,
      },
      disconnectConnection: {
        identifier: '',
        show: false,
      },
    }
  },
  head() {
    return {
      title: `${this.$t('connections')} - ${this.$config.projectTitle}`,
    }
  },
  computed: {
    application() {
      return getCurrentApplication(this.$store.state, this.$route.params.slug)
    },
    connections() {
      return [
        // {
        //   identifier: 'aweoij34ioj35323423',
        //   startAt: 123123123123123,
        //   finishAt: 1238912347192348,
        //   ipAddress: '192.168.1.1',
        //   userAgent: 'Firefox MacOS 2.20',
        // },
      ]
    },
  },
  methods: {
    copyIdentifier(identifier: string) {
      navigator.clipboard.writeText(identifier)
      this.$toast.show(this.$t('copiedIdentifier').toString())
    },
    toggleShowSubscribeChannel() {
      this.subscribeChannel.show = !this.subscribeChannel.show
      this.subscribeChannel.identifier = ''
    },
    toggleShowDisconnectConnection() {
      this.disconnectConnection.show = !this.disconnectConnection.show
      this.disconnectConnection.identifier = ''
    },
    setSubscribeChannel(identifier: string) {
      this.subscribeChannel.identifier = identifier
      this.subscribeChannel.show = true
    },
    setDisconnectConnection(identifier: string) {
      this.disconnectConnection.identifier = identifier
      this.disconnectConnection.show = true
    },
    disconnectConnectionForm() {},
    subscribeChannelForm() {},
  },
})
</script>

<i18n>
{
  "en": {
    "connections": "Connections",
    "noConnections": "There are no connections available for this application",
    "readMore": "Read configuration steps",
    "disconnectConnection": "Disconnect connection",
    "copyIdentifier": "Copy identifier",
    "subscribeChannel": "Subscribe to channel",
    "actions": "Actions",
    "today": "Today",
    "copiedIdentifier": "Copied connection identifier",
    "ip": "IP",
    "minutes": "minutes",
    "active": "Active",
    "disconnectConnectionDescription": "Connection {identifier} will be unable to receive or send any more messages",
    "channelName": "Channel name",
    "enterName": "Enter name",
    "cancel": "Cancel"
  },
  "es": {
    "connections": "Conexiones",
    "noConnections": "No hay conexiones disponibles para esta aplicación",
    "readMore": "Leer pasos de configuración",
    "disconnectConnection": "Desconectar conexión",
    "copyIdentifier": "Copiar identificador",
    "subscribeChannel": "Suscribir a un canal",
    "actions": "Acciones",
    "today": "Hoy",
    "copiedIdentifier": "Copiada la identificación de la conexión",
    "ip": "IP",
    "minutes": "minutos",
    "active": "Activas",
    "disconnectConnectionDescription": "La conexión {identifier} no podrá enviar o recibir más mensajes",
    "channelName": "Nombre del canal",
    "enterName": "Introduce un nombre",
    "cancel": "Cancelar"
  }
}
</i18n>
