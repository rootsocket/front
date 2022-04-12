<template>
  <div class="flex flex-wrap-reverse">
    <AppPage>
      <h1>{{ $t('debug') }}</h1>

      <div v-if="!isConnected" class="w-full flex justify-center items-center">
        <div class="flex flex-col items-center mt-10 mb-20">
          <div
            class="rounded-full h-20 w-20 flex flex-row items-center justify-center text-primary-500 bg-primary-100 dark:text-gray-100 dark:bg-gray-700"
          >
            <IconBug class="h-14 w-14" />
          </div>
          <span class="my-4 w-60 text-center text-gray-600">
            {{ $t('debugWarning') }}
          </span>
          <ButtonPressable
            variant="outline"
            :value="$t('connectDebugger')"
            @click="startDebugger"
          />
        </div>
      </div>
      <div v-else class="w-full flex justify-center items-center">
        <div class="flex flex-row items-center mt-10 mb-20">
          <span class="text-center text-gray-600">
            {{ $t('waitingDebugger') }}
          </span>
        </div>
      </div>
    </AppPage>
  </div>
</template>

<script lang="ts">
import RootSocket from 'rootsocketjs'
import Vue from 'vue'
import { getCurrentApplication } from '@/utils/application'
import { Key } from '~/types/application'

const isDev = process.env.NODE_ENV === 'development'

export default Vue.extend({
  layout: 'application',
  data(): { rootSocket?: RootSocket; isConnected: boolean } {
    return {
      rootSocket: undefined,
      isConnected: false,
    }
  },
  head() {
    return {
      title: `${this.$t('debug')} - ${this.$config.projectTitle}`,
    }
  },
  computed: {
    application() {
      return getCurrentApplication(this.$store.state, this.$route.params.slug)
    },
    validKey(): Key | undefined {
      return this.application.keys?.find(
        (i: Key) => new Date(i.expiresAt) > new Date()
      )
    },
  },
  methods: {
    getConnectionUrl(): string {
      const suffix = '/api/v1/connections/'
      if (isDev) {
        return `${process.env.wsUrl!}${suffix}`
      }

      return `${this.application.region}.${process.env.wsUrl!}${suffix}`
    },
    getServerUrl(): string {
      if (isDev) {
        return process.env.wsUrl?.replace('http://', '') ?? ''
      }

      return `${this.application.region}.${process.env.wsUrl!}`
    },
    startDebugger() {
      if ((this.application.keys ?? []).length === 0) {
        this.$toast.show(this.$t('createKey'))
        return
      }

      if (this.validKey?.identifier) {
        this.rootSocket = new RootSocket({
          server: this.getServerUrl(),
          connectionUrl: this.getConnectionUrl(),
          fetchOptions: {
            headers: { Authorization: this.validKey.identifier },
          },
          debug: isDev,
          // @ts-ignore
          disableTLS: isDev,
        })
        this.rootSocket.onRawOpen = () => {
          this.isConnected = true
          return this.rootSocket?.onMessageOpen
        }

        this.rootSocket.onRawClose = () => {
          this.isConnected = false
          return this.rootSocket?.onMessageClose
        }

        this.rootSocket?.connect()
      }
    },
  },
})
</script>

<i18n>
{
  "en": {
    "debug": "Debug",
    "connectDebugger": "Connect debugger",
    "debugWarning": "You will be able to subscribe to channels, send and read messages",
    "createKey": "Create a key",
    "waitingDebugger": "Waiting for events..."
  },
  "es": {
    "debug": "Depurar",
    "connectDebugger": "Conectar depurador",
    "debugWarning": "Podrás subsribirte a canales, recibir y enviar mensajes",
    "createKey": "Crea una clave",
    "waitingDebugger": "Esperando eventos..."
  }
}
</i18n>
