<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <div class="flex flex-row items-center justify-between mb-6">
        <h1 class="text-4xl">{{ $t('connections') }}</h1>
        <h1
          v-show="totalConnectionsCount !== 0 && !isLoadingConnections"
          class="text-4xl"
        >
          {{
            Intl.NumberFormat('en', { notation: 'compact' }).format(
              totalConnectionsCount
            )
          }}
        </h1>
      </div>
      <div
        v-if="totalConnectionsCount === 0 && !isLoadingConnections"
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
      <div
        v-if="isLoadingConnections"
        class="w-full flex justify-center items-center h-40"
      >
        <IconLoad />
      </div>
      <div
        v-if="totalConnectionsCount !== 0 && !isLoadingConnections"
        class="grid grid-cols-1 gap-4"
      >
        <div
          class="w-full border dark:border-gray-800 rounded-md hover:shadow-sm flex flex-col"
        >
          <div class="p-4 mb-2">
            <span
              class="text-gray-500 uppercase tracking-wider font-bold text-md w-full flex flex-row"
            >
              {{ $t('graph') }}
            </span>
            <span class="text-sm">
              {{ $t('graphDescription') }}
            </span>
          </div>
          <div class="h-40">
            <ChartLine
              :labels="Object.keys(timeMap)"
              :data="Object.values(timeMap).map((i) => i.count)"
            />
          </div>
        </div>
        <div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              class="w-full border dark:border-gray-800 rounded-md hover:shadow-sm flex flex-col"
            >
              <div class="p-4 mb-2">
                <span
                  class="text-gray-500 uppercase tracking-wider font-bold text-md w-full flex flex-row"
                >
                  {{ $t('browser') }}
                </span>
                <span class="text-sm">
                  {{ $t('browserDescription') }}
                </span>
                <div class="flex flex-col">
                  <div v-for="k in Object.keys(agentMap)" :key="k">
                    <span
                      class="flex flex-row justify-between items-center mt-2"
                    >
                      <span class="flex flex-row items-center">
                        <component
                          :is="getAgentIcon(k)"
                          class="bg-gray-200 text-gray-700 rounded-full p-1 w-7 h-7 flex flex-row items-center justify-center mr-4"
                        ></component>
                        <span>{{ k }}</span>
                      </span>
                      <span>{{ agentMap[k] }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="w-full border dark:border-gray-800 rounded-md hover:shadow-sm flex flex-col"
            >
              <div class="p-4 mb-2">
                <span
                  class="text-gray-500 uppercase tracking-wider font-bold text-md w-full flex flex-row"
                >
                  {{ $t('system') }}
                </span>
                <span class="text-sm">
                  {{ $t('systemDescription') }}
                </span>

                <div class="flex flex-col">
                  <div v-for="k in Object.keys(osMap)" :key="k">
                    <span
                      class="flex flex-row justify-between items-center mt-2"
                    >
                      <span class="flex flex-row items-center">
                        <component
                          :is="getOsIcon(k)"
                          class="bg-gray-200 text-gray-700 rounded-full p-1 w-7 h-7 flex flex-row items-center justify-center mr-4"
                        ></component>
                        <span>{{ k }}</span>
                      </span>
                      <span>{{ osMap[k] }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
      chartData: {
        labels: ['January', 'February', 'March'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
      chartOptions: {
        responsive: true,
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
    totalConnectionsCount() {
      const result: any = Object.values(
        this.$store.state.application.connections.data?.os ?? {}
      ).reduce((previous: number, current: any) => previous + current, 0)
      return result
    },
    osMap() {
      return this.$store.state.application.connections.data?.os ?? {}
    },
    agentMap() {
      return this.$store.state.application.connections.data?.userAgent ?? {}
    },
    timeMap() {
      return this.$store.state.application.connections.data?.time ?? {}
    },
    isLoadingConnections() {
      return this.$store.state.application.connections.loading
    },
  },
  beforeMount() {
    this.$store.dispatch('application/getConnections', {
      identifier: this.application.identifier,
      region: this.application.region,
    })
  },
  methods: {
    getAgentIcon(type: string) {
      const lower = type.toLowerCase()

      if (lower.includes('chrome')) {
        return 'IconChrome'
      } else if (lower.includes('firefox')) {
        return 'IconFirefox'
      } else if (lower.includes('safari')) {
        return 'IconSafari'
      }

      return 'IconWorld'
    },
    getOsIcon(type: string) {
      const lower = type.toLowerCase()

      if (lower.includes('windows')) {
        return 'IconWindows'
      } else if (lower.includes('linux')) {
        return 'IconLinux'
      } else if (lower.includes('mac')) {
        return 'IconMac'
      } else if (lower.includes('android')) {
        return 'IconAndroid'
      } else if (lower.includes('ios')) {
        return 'IconIOS'
      }

      return 'IconDevice'
    },
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
  },
})
</script>

<i18n>
{
  "en": {
    "connections": "Active connections",
    "noConnections": "There are no connections available for this application",
    "readMore": "Read configuration steps",
    "disconnectConnection": "Disconnect connection",
    "copyIdentifier": "Copy identifier",
    "subscribeChannel": "Subscribe to channel",
    "actions": "Actions",
    "today": "Today",
    "copiedIdentifier": "Copied connection identifier",
    "ip": "IP",
    "minutes": "{count} minutes",
    "graph": "Graph",
    "disconnectConnectionDescription": "Connection {identifier} will be unable to receive or send any more messages",
    "channelName": "Channel name",
    "enterName": "Enter name",
    "cancel": "Cancel",
    "graphDescription": "All active connections grouped by connection hour",
    "browser": "Client",
    "browserDescription": "All browsers and clients",
    "system": "System",
    "systemDescription": "All operative systems"
  },
  "es": {
    "connections": "Conexiones activas",
    "noConnections": "No hay conexiones disponibles para esta aplicación",
    "readMore": "Leer pasos de configuración",
    "disconnectConnection": "Desconectar conexión",
    "copyIdentifier": "Copiar identificador",
    "subscribeChannel": "Suscribir a un canal",
    "actions": "Acciones",
    "today": "Hoy",
    "copiedIdentifier": "Copiada la identificación de la conexión",
    "ip": "IP",
    "minutes": "{count} minutos",
    "graph": "Gráfico",
    "disconnectConnectionDescription": "La conexión {identifier} no podrá enviar o recibir más mensajes",
    "channelName": "Nombre del canal",
    "enterName": "Introduce un nombre",
    "cancel": "Cancelar",
    "graphDescription": "Todas las conexiones activas agrupadas por hora de conexión",
    "browser": "Cliente",
    "browserDescription": "Todos los navegadores y clientes",
    "system": "Sistema",
    "systemDescription": "Todos los sistemas operativos"
  }
}
</i18n>
